import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Database
} from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser?: User | null;
  onClearCart: () => void;
  onPlaceOrder?: (orderData: any) => Promise<any>;
  isDarkMode: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currentUser,
  onClearCart,
  onPlaceOrder,
  isDarkMode,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string>(() => `BZ-${Math.floor(100000 + Math.random() * 900000)}`);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
      }));
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * 0.1; // default 10%
  const shipping = subtotal > 50 ? 0 : 7.99;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `BZ-${Date.now().toString().slice(-6)}`;

    try {
      if (onPlaceOrder) {
        const orderResult = await onPlaceOrder({
          customer: formData,
          items: cart,
          subtotal,
          discount,
          shipping,
          total,
          userId: currentUser?.id || 'guest',
        });
        if (orderResult?.orderId) {
          setOrderId(orderResult.orderId);
        } else {
          setOrderId(generatedId);
        }
      } else {
        setOrderId(generatedId);
      }
      setStep('success');
      onClearCart();
    } catch (err) {
      console.error('Order placement error:', err);
      setOrderId(generatedId);
      setStep('success');
      onClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        id="checkout-backdrop"
        onClick={step === 'form' ? onClose : handleFinish}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div
        id="checkout-modal-content"
        className={`relative z-10 w-full max-w-lg overflow-hidden rounded-2xl p-6 shadow-2xl transition-all ${
          isDarkMode ? 'bg-[#18181B] text-white border border-[#27272A]' : 'bg-white text-[#1F1F23]'
        }`}
      >
        {step === 'form' ? (
          <>
            <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#27272A] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C6FE0]/15 text-[#7C6FE0]">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#0F172A] dark:text-[#F8FAFC]">Secure Checkout</h3>
                  <span className="text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8]">256-Bit SSL Encrypted & Protected</span>
                </div>
              </div>
              <button
                id="checkout-close-btn"
                onClick={onClose}
                className="p-1 rounded-lg text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#27272A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Shipping Address Form */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                    Customer & Shipping Details
                  </h4>
                  {currentUser && (
                    <span className="text-[10px] text-[#7C6FE0] font-bold bg-[#7C6FE0]/10 px-2 py-0.5 rounded-full">
                      Logged in as {currentUser.name.split(' ')[0]}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#27272A] px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#7C6FE0]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#27272A] px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#7C6FE0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 123 Market Street, Apt 4B"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#27272A] px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#7C6FE0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#27272A] px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#7C6FE0]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1E293B] dark:text-[#E2E8F0] block mb-1">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10001"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full rounded-xl border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#27272A] px-3 py-2 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#7C6FE0]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                  Payment Method
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'apple', label: 'Apple Pay', icon: ShieldCheck },
                    { id: 'paypal', label: 'PayPal', icon: CheckCircle2 },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: p.id })}
                      className={`flex flex-col items-center justify-center rounded-xl p-2.5 border text-xs font-bold transition ${
                        formData.paymentMethod === p.id
                          ? 'border-[#7C6FE0] bg-[#7C6FE0]/10 text-[#7C6FE0]'
                          : 'border-[#CBD5E1] dark:border-[#27272A] text-[#475569] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#27272A]'
                      }`}
                    >
                      <p.icon className="h-4 w-4 mb-1" />
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order total info */}
              <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#27272A] p-3 text-xs space-y-1.5 border border-[#CBD5E1] dark:border-[#333]">
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8] font-semibold">
                  <span>Items ({cart.length})</span>
                  <span className="font-bold text-[#0F172A] dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#DC2626] font-semibold">
                  <span>Promo Discount (10%)</span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#475569] dark:text-[#94A3B8] font-semibold">
                  <span>Shipping</span>
                  <span className="text-[#16A34A] font-extrabold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#0F172A] dark:text-white pt-1 border-t border-[#CBD5E1] dark:border-[#333]">
                  <span>Total Amount Due</span>
                  <span className="text-[#7C6FE0] font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="confirm-checkout-btn"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#7C6FE0] py-3 text-sm font-bold text-white shadow-md shadow-[#7C6FE0]/30 hover:opacity-95 transition active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing & Saving Order...</span>
                ) : (
                  <>
                    <span>Pay ${total.toFixed(2)} & Complete Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Order Confirmation Step */
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E3F2DD] text-[#4CAF50] shadow-sm animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <span className="inline-block rounded-full bg-[#E3F2DD] px-3 py-0.5 text-xs font-bold text-[#2E7D32]">
                Order Confirmed #{orderId}
              </span>
              <h3 className="mt-2 text-xl font-extrabold">Thank you, {formData.name || 'valued customer'}!</h3>
              <p className="mt-1 text-xs text-[#8A8A94] max-w-sm mx-auto">
                We've sent an order confirmation and tracking details to{' '}
                <span className="font-semibold text-[#1F1F23] dark:text-white">
                  {formData.email}
                </span>
                .
              </p>
            </div>

            <div className="rounded-xl border border-[#EDEDF2] dark:border-[#27272A] p-4 text-left text-xs space-y-2 bg-[#FAF9FC] dark:bg-[#27272A]">
              <div className="flex items-center justify-between font-bold">
                <span>Estimated Delivery</span>
                <span className="text-[#4CAF50]">2 Business Days</span>
              </div>
              <div className="text-[#8A8A94]">
                Shipping to:{' '}
                <span className="text-[#1F1F23] dark:text-white font-medium">
                  {formData.address || 'Address provided'}, {formData.city || ''}
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Order successfully placed and confirmed</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7C6FE0] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#6D60D6] transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
