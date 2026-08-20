import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedColor?: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  isDarkMode: boolean;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isDarkMode,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!isOpen || !product) return null;

  const activeColor = selectedColor || (product.colors && product.colors[0]) || '';

  const handleAdd = () => {
    onAddToCart(product, activeColor, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        id="quickview-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Card */}
      <div
        id="quickview-modal-content"
        className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#18181B] text-white border border-[#27272A]' : 'bg-white text-[#1F1F23]'
        }`}
      >
        {/* Close Button */}
        <button
          id="quickview-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-[#8A8A94] hover:text-[#1F1F23] dark:hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-[#F7F7FA] dark:bg-[#27272A] p-6 flex items-center justify-center">
            {product.badge && (
              <span className="absolute top-4 left-4 rounded-lg bg-[#FF4D4D] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                {product.badge}
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-72 w-full object-contain rounded-xl"
            />
          </div>

          {/* Details Column */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#7C6FE0]">
                {product.category}
              </span>
              <h3 className="text-lg font-bold mt-1 text-[#0F172A] dark:text-[#F8FAFC] leading-snug">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">{product.rating}</span>
                <span className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#7C6FE0]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8] line-through font-semibold">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="text-xs font-extrabold text-[#FF4D4D] bg-[#F5E1E8] px-2 py-0.5 rounded">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs font-medium text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                {product.description ||
                  'Crafted with premium materials for unmatched comfort, longevity, and modern aesthetics.'}
              </p>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">Select Color:</span>
                  <div className="flex items-center gap-2">
                    {product.colors.map((hex, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(hex)}
                        className={`h-6 w-6 rounded-full border-2 transition-all ${
                          activeColor === hex
                            ? 'border-[#7C6FE0] ring-2 ring-[#7C6FE0]/40 scale-110'
                            : 'border-white dark:border-[#18181B] opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#CBD5E1] dark:border-[#27272A] space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl border border-[#CBD5E1] dark:border-[#27272A] p-1 bg-[#F1F5F9] dark:bg-[#27272A]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm font-bold text-[#334155] dark:text-[#CBD5E1] hover:text-[#7C6FE0]"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-sm font-bold text-[#334155] dark:text-[#CBD5E1] hover:text-[#7C6FE0]"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  id="modal-add-cart-btn"
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition ${
                    justAdded
                      ? 'bg-[#4CAF50]'
                      : 'bg-gradient-to-r from-[#A78BFA] to-[#7C6FE0] hover:opacity-95'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-xl border border-[#CBD5E1] dark:border-[#27272A] transition ${
                    isWishlisted
                      ? 'bg-[#FF4D4D] text-white border-transparent'
                      : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#FF4D4D] hover:bg-[#FAF9FC] dark:hover:bg-[#27272A]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-[#4CAF50]" /> 100% Authentic
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3 text-[#7C6FE0]" /> Fast Shipping
                </span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="h-3 w-3 text-[#0284C7]" /> 30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
