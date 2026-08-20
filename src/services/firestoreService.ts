import { firestore, auth } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  Unsubscribe,
  QueryConstraint
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Product, CartItem, NotificationItem } from '../types';
import { BEST_DEALS, RECOMMENDED_PRODUCTS } from '../data/mockData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Ensures a valid Firebase Auth user exists.
 * If not authenticated, silently signs in anonymously so that guest carts persist in Firestore.
 */
export async function ensureFirebaseAuth(): Promise<FirebaseUser | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          resolve(userCredential.user);
        } catch (err) {
          console.warn('Anonymous sign-in skipped or failed:', err);
          resolve(null);
        }
      }
    });
  });
}

/**
 * Seed initial catalog to Firestore `products` collection if empty.
 */
export async function seedProductsToFirestore(): Promise<void> {
  const path = 'products';
  try {
    const productsRef = collection(firestore, 'products');
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) {
      return; // Already populated
    }

    const allSeed = [...BEST_DEALS, ...RECOMMENDED_PRODUCTS];
    const batch = writeBatch(firestore);

    allSeed.forEach((prod) => {
      const docRef = doc(firestore, 'products', prod.id);
      batch.set(docRef, {
        ...prod,
        isDeal: Boolean((prod.discountPercentage && prod.discountPercentage >= 20) || prod.isHot),
        isNewArrival: Boolean(prod.id.startsWith('rec-') || prod.id.startsWith('deal-1')),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    await batch.commit();
    console.log('[Firestore] Seeded initial products catalog');
  } catch (err: any) {
    // If permission denied because rules require staff, catch gracefully
    console.warn('[Firestore] Seed products warning:', err?.message || err);
  }
}

/**
 * Subscribe to real-time products collection from Firestore.
 */
export function subscribeProductsFromFirestore(
  onUpdate: (products: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = 'products';
  const productsRef = collection(firestore, 'products');

  return onSnapshot(
    productsRef,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Product;
        items.push({
          ...data,
          id: docSnap.id,
        });
      });

      // If empty in Firestore, fallback to catalog
      if (items.length === 0) {
        onUpdate([...BEST_DEALS, ...RECOMMENDED_PRODUCTS]);
      } else {
        onUpdate(items);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (e: any) {
        if (onError) onError(e);
        // Fallback to initial mock data on error
        onUpdate([...BEST_DEALS, ...RECOMMENDED_PRODUCTS]);
      }
    }
  );
}

/**
 * Subscribe to user's real-time cart document in Firestore `carts/{userId}`.
 */
export function subscribeUserCart(
  userId: string,
  onUpdate: (items: CartItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `carts/${userId}`;
  const cartDocRef = doc(firestore, 'carts', userId);

  return onSnapshot(
    cartDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate(Array.isArray(data.items) ? data.items : []);
      } else {
        onUpdate([]);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

/**
 * Add or update an item in user's cart in Firestore `carts/{userId}`.
 */
export async function addItemToFirestoreCart(
  userId: string,
  product: Product,
  selectedColor?: string,
  quantity: number = 1
): Promise<CartItem[]> {
  const path = `carts/${userId}`;
  try {
    const cartDocRef = doc(firestore, 'carts', userId);
    const docSnap = await getDoc(cartDocRef);
    let items: CartItem[] = [];

    if (docSnap.exists()) {
      const data = docSnap.data();
      items = Array.isArray(data.items) ? [...data.items] : [];
    }

    const existingIndex = items.findIndex(
      (item) => item.productId === product.id && (!selectedColor || item.color === selectedColor)
    );

    if (existingIndex > -1) {
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + quantity,
      };
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        variant: selectedColor ? `${selectedColor} / Standard` : product.variant || 'Standard Edition',
        color: selectedColor,
        quantity: quantity,
      };
      items.unshift(newItem);
    }

    await setDoc(
      cartDocRef,
      {
        userId,
        items,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return [];
  }
}

/**
 * Update quantity of an item in user's cart in Firestore.
 */
export async function updateFirestoreCartItemQty(
  userId: string,
  itemId: string,
  delta: number
): Promise<CartItem[]> {
  const path = `carts/${userId}`;
  try {
    const cartDocRef = doc(firestore, 'carts', userId);
    const docSnap = await getDoc(cartDocRef);
    if (!docSnap.exists()) return [];

    let items: CartItem[] = docSnap.data().items || [];
    items = items
      .map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    await setDoc(
      cartDocRef,
      {
        userId,
        items,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return [];
  }
}

/**
 * Remove an item from user's cart in Firestore.
 */
export async function removeFirestoreCartItem(userId: string, itemId: string): Promise<CartItem[]> {
  const path = `carts/${userId}`;
  try {
    const cartDocRef = doc(firestore, 'carts', userId);
    const docSnap = await getDoc(cartDocRef);
    if (!docSnap.exists()) return [];

    let items: CartItem[] = docSnap.data().items || [];
    items = items.filter((item) => item.id !== itemId);

    await setDoc(
      cartDocRef,
      {
        userId,
        items,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return [];
  }
}

/**
 * Clear user's cart in Firestore.
 */
export async function clearFirestoreCart(userId: string): Promise<void> {
  const path = `carts/${userId}`;
  try {
    const cartDocRef = doc(firestore, 'carts', userId);
    await setDoc(
      cartDocRef,
      {
        userId,
        items: [],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to user's wishlist in Firestore `wishlists/{userId}`.
 */
export function subscribeUserWishlist(
  userId: string,
  onUpdate: (items: Product[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const path = `wishlists/${userId}`;
  const wishlistDocRef = doc(firestore, 'wishlists', userId);

  return onSnapshot(
    wishlistDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate(Array.isArray(data.items) ? data.items : []);
      } else {
        onUpdate([]);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}

/**
 * Toggle product in user's wishlist in Firestore.
 */
export async function toggleFirestoreWishlist(userId: string, product: Product): Promise<Product[]> {
  const path = `wishlists/${userId}`;
  try {
    const wishlistDocRef = doc(firestore, 'wishlists', userId);
    const docSnap = await getDoc(wishlistDocRef);
    let items: Product[] = [];

    if (docSnap.exists()) {
      const data = docSnap.data();
      items = Array.isArray(data.items) ? [...data.items] : [];
    }

    const index = items.findIndex((p) => p.id === product.id);
    if (index > -1) {
      items.splice(index, 1);
    } else {
      items.unshift(product);
    }

    await setDoc(
      wishlistDocRef,
      {
        userId,
        items,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return [];
  }
}
