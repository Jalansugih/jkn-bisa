import React, { useState, useEffect } from 'react';
import { Product, OrderItem, AuthUser } from '../../types';
import { PRODUCTS_DATA } from '../../data/mockData';
import { AVAILABLE_PAYMENT_METHODS as PAYMENT_METHODS, PaymentMethodId, PaymentGroup } from '../../data/paymentMethods';
import {
  ShoppingCart,
  X,
  Gift,
  MessageCircle,
  Receipt,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Landmark,
  QrCode,
  Wallet,
  UserCheck,
} from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productKey: string;
  products?: Product[];
  /** User yang sedang login. Jika ada, data diri otomatis diisi dari akun & form tidak ditampilkan lagi. */
  currentUser?: AuthUser | null;
  onOrderCompleted: (
    orderDraft: Omit<OrderItem, 'id' | 'date' | 'status'>,
    method: 'whatsapp' | 'online'
  ) => void | Promise<void>;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

type OrderStep = 'cart' | 'payment';

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  productKey,
  products,
  currentUser,
  onOrderCompleted,
  showToast,
}) => {
  // Step 1 = Keranjang (cart), Step 2 = Pembayaran (payment)
  const [step, setStep] = useState<OrderStep>('cart');

  const [addonDomain, setAddonDomain] = useState(false);
  const [addonExpress, setAddonExpress] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('bca');

  const product: Product = React.useMemo(() => {
    if (products && products.length > 0) {
      const found = products.find((p) => p.id === productKey && p.active !== false);
      if (found) return found;
      return Object.values(PRODUCTS_DATA)[0];
    }
    return PRODUCTS_DATA[productKey] || PRODUCTS_DATA['website_pro'] || Object.values(PRODUCTS_DATA)[0];
  }, [products, productKey]);

  useEffect(() => {
    // Reset state every time the modal is opened for a (possibly new) product
    if (isOpen) {
      setStep('cart');
      setAddonDomain(false);
      setAddonExpress(false);
      setCouponCode('');
      setCouponMessage(null);
      setDiscountAmount(0);
      setPaymentMethod('bca');
      setShowNotes(false);
      setNotes('');
    }
  }, [isOpen, productKey]);

  // Akun sudah login -> isi otomatis data diri dari profil (tanpa menimpa yang sudah diketik)
  useEffect(() => {
    if (!isOpen || !currentUser) return;
    setName((v) => v || currentUser.name || '');
    setBrand((v) => v || currentUser.businessName || '');
    setWhatsapp((v) => v || currentUser.whatsapp || '');
    setEmail((v) => v || currentUser.email || '');
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const isLoggedIn = !!currentUser;
  // Untuk user login, form hanya muncul jika data wajib di profil masih kosong
  const missingName = !name.trim();
  const missingBrand = !brand.trim();
  const missingWa = !whatsapp.trim();
  const needsProfileForm = !isLoggedIn || missingName || missingBrand || missingWa;

  const basePrice = product.price;
  const addonsPrice = (addonDomain ? 150000 : 0) + (addonExpress ? 300000 : 0);
  const totalPrice = Math.max(0, basePrice + addonsPrice - discountAmount);
  const itemCount = 1 + (addonDomain ? 1 : 0) + (addonExpress ? 1 : 0);

  const handleApplyCoupon = () => {
    const trimmed = couponCode.trim().toUpperCase();
    if (trimmed === 'UMKMMAJU') {
      setDiscountAmount(100000);
      setCouponMessage({
        text: '✓ Kode UMKMMAJU berhasil terpasang! Potongan Rp 100.000',
        isSuccess: true,
      });
      showToast('Voucher UMKMMAJU digunakan! Potongan Rp 100.000', 'success');
    } else {
      setDiscountAmount(0);
      setCouponMessage({
        text: 'Kode voucher tidak valid. Coba: UMKMMAJU',
        isSuccess: false,
      });
    }
  };

  // Move from Keranjang -> Pembayaran
  const handleGoToPayment = () => {
    setStep('payment');
  };

  const handleBackToCart = () => {
    setStep('cart');
  };

  const handleOrderSubmit = async (method: 'whatsapp' | 'online') => {
    if (!name.trim() || !brand.trim() || !whatsapp.trim()) {
      showToast('Mohon lengkapi Nama Lengkap, Brand Usaha & No. WhatsApp', 'warning');
      return;
    }

    const addonsList: string[] = [];
    if (addonDomain) addonsList.push('Domain Custom .com/.co.id (+Rp 150.000)');
    if (addonExpress) addonsList.push('Pengerjaan Kilat 3 Hari (+Rp 300.000)');

    const orderDraft: Omit<OrderItem, 'id' | 'date' | 'status'> = {
      product: product.name,
      productId: product.id,
      productPrice: product.price,
      brand: brand.trim(),
      name: name.trim(),
      wa: whatsapp.trim(),
      email: email.trim(),
      total: 'Rp ' + totalPrice.toLocaleString('id-ID'),
      addons: addonsList,
      notes: notes.trim(),
      paymentMethod,
    };

    setIsSubmitting(true);
    try {
      await onOrderCompleted(orderDraft, method);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disc = product.discountPct || 50;
  const strikeVal = product.originalPrice || Math.round(product.price / (1 - disc / 100));

  return (
    <div
      id="orderModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                {step === 'cart' ? 'Keranjang Pesanan' : 'Pembayaran'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'cart'
                  ? 'Periksa paket & layanan tambahan Anda'
                  : needsProfileForm
                  ? 'Lengkapi data diri untuk menyelesaikan pesanan'
                  : 'Pilih metode pembayaran untuk menyelesaikan pesanan'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-1 bg-white text-[11px] font-bold">
          <div
            className={`flex items-center gap-1.5 ${
              step === 'cart' ? 'text-blue-600' : 'text-emerald-600'
            }`}
          >
            {step === 'payment' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                1
              </span>
            )}
            <span>Keranjang</span>
          </div>
          <div className={`flex-1 h-0.5 rounded ${step === 'payment' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-blue-600' : 'text-slate-400'}`}>
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                step === 'payment' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              2
            </span>
            <span>Pembayaran</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'cart' ? (
            <>
              {/* Selected Product Banner */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                    Paket Dipilih ({itemCount} item)
                  </span>
                  <h4 id="orderProductName" className="font-heading font-bold text-base text-slate-900">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="line-through text-slate-400 font-medium text-xs">
                      Rp {strikeVal.toLocaleString('id-ID')}
                    </span>
                    <span className="font-extrabold text-slate-900 text-xs">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    <span className="bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-[10px] px-1.5 py-0.5 rounded ml-1">
                      -{disc}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2.5 py-1 rounded-full">
                    Garansi Penuh
                  </span>
                </div>
              </div>

              {/* Bonus Notice for PT Pro */}
              {product.bonus && (
                <div className="text-xs bg-emerald-50 text-emerald-800 p-3 rounded-2xl border border-emerald-200 font-bold flex items-center gap-2 shadow-xs">
                  <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
                  <span>{product.bonus}</span>
                </div>
              )}

              {/* Add-ons Selection */}
              <div>
                <label className="block font-heading font-bold text-xs text-slate-900 mb-2">
                  Layanan Tambahan (Opsional)
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 cursor-pointer text-slate-700 transition">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="addonDomain"
                        checked={addonDomain}
                        onChange={(e) => setAddonDomain(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Domain Custom .com / .co.id Tambahan</span>
                    </div>
                    <span className="font-bold text-slate-900">+150.000</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 cursor-pointer text-slate-700 transition">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        id="addonExpress"
                        checked={addonExpress}
                        onChange={(e) => setAddonExpress(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Pengerjaan Kilat 3 Hari</span>
                    </div>
                    <span className="font-bold text-slate-900">+300.000</span>
                  </label>
                </div>
              </div>

              {/* Coupon Input */}
              <div>
                <label className="block font-heading font-bold text-xs text-slate-900 mb-1">Voucher Diskon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="couponInput"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                    placeholder="Gunakan kode: UMKMMAJU"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-blue-600 cursor-pointer transition shadow-xs"
                  >
                    Gunakan
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1 font-semibold ${
                      couponMessage.isSuccess ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Harga Paket Dasar:</span>
                  <span>Rp {basePrice.toLocaleString('id-ID')}</span>
                </div>
                {addonsPrice > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Layanan Tambahan:</span>
                    <span>+Rp {addonsPrice.toLocaleString('id-ID')}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Diskon Promo (UMKMMAJU):</span>
                    <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Pembayaran:</span>
                  <span className="text-blue-600 font-extrabold text-base">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mini cart recap on the payment step */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">
                      Ringkasan Keranjang
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{product.name}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Ubah
                  </button>
                </div>
                {(addonDomain || addonExpress) && (
                  <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                    {addonDomain && <li>Domain Custom .com / .co.id (+Rp 150.000)</li>}
                    {addonExpress && <li>Pengerjaan Kilat 3 Hari (+Rp 300.000)</li>}
                  </ul>
                )}
                {discountAmount > 0 && (
                  <p className="text-[11px] text-emerald-600 font-semibold">
                    Voucher UMKMMAJU: -Rp {discountAmount.toLocaleString('id-ID')}
                  </p>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Tagihan:</span>
                  <span className="text-blue-600 font-extrabold text-base">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Data diri: ringkas untuk user login, form lengkap untuk tamu */}
              {isLoggedIn && !needsProfileForm ? (
                <div className="space-y-2">
                  <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3 text-xs flex items-start gap-2.5">
                    <UserCheck className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{name}</p>
                      <p className="text-slate-600 truncate">
                        {brand} &middot; {whatsapp}
                        {email ? ` · ${email}` : ''}
                      </p>
                      <p className="text-[10px] text-blue-700 font-semibold mt-0.5">
                        Data diambil dari akun Anda
                      </p>
                    </div>
                  </div>
                  {showNotes ? (
                    <textarea
                      id="custNotes"
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none resize-none transition"
                      placeholder="Catatan khusus atau bidang usaha Anda (opsional)..."
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowNotes(true)}
                      className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      + Tambah catatan (opsional)
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <label className="block font-heading font-bold text-xs text-slate-900">
                    {isLoggedIn ? 'Lengkapi Data yang Belum Terisi' : 'Data Diri & Identitas Usaha'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(!isLoggedIn || missingName) && (
                      <input
                        type="text"
                        id="custName"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        placeholder="Nama Lengkap Pemilik *"
                      />
                    )}
                    {(!isLoggedIn || missingBrand) && (
                      <input
                        type="text"
                        id="custBrand"
                        required
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        placeholder="Nama Usaha / Toko *"
                      />
                    )}
                    {(!isLoggedIn || missingWa) && (
                      <input
                        type="tel"
                        id="custWA"
                        required
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        placeholder="No WhatsApp (Aktif) *"
                      />
                    )}
                    {!isLoggedIn && (
                      <input
                        type="email"
                        id="custEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                        placeholder="Alamat Email"
                      />
                    )}
                  </div>
                  <textarea
                    id="custNotes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none resize-none transition"
                    placeholder="Catatan khusus atau bidang usaha Anda..."
                  />
                </div>
              )}

              {/* Metode Pembayaran */}
              <div className="space-y-2 pt-1">
                <label className="block font-heading font-bold text-xs text-slate-900">
                  Metode Pembayaran
                </label>
                {(['Transfer Bank', 'QRIS', 'E-Wallet'] as PaymentGroup[]).map((group) => {
                  const items = PAYMENT_METHODS.filter((m) => m.group === group);
                  if (items.length === 0) return null;
                  const Icon = group === 'Transfer Bank' ? Landmark : group === 'QRIS' ? QrCode : Wallet;
                  return (
                    <div key={group}>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <Icon className="w-3 h-3" /> {group}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {items.map((m) => {
                          const selected = paymentMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id)}
                              className={`text-left px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                                selected
                                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                                  : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-blue-300 hover:bg-white'
                              }`}
                            >
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <p className="text-[11px] text-slate-500">
                  Detail rekening / QR pembayaran akan tampil di invoice setelah pesanan dibuat.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
          {step === 'cart' ? (
            <button
              id="btn-cart-go-payment"
              onClick={handleGoToPayment}
              className="w-full sm:ml-auto sm:w-auto sm:px-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <span>Lanjut ke Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleBackToCart}
                disabled={isSubmitting}
                className="px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-60"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
              <button
                id="btn-order-wa-direct"
                onClick={() => handleOrderSubmit('whatsapp')}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4" />
                )}
                <span>Order via WhatsApp Direct</span>
              </button>
              <button
                id="btn-order-get-invoice"
                onClick={() => handleOrderSubmit('online')}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Receipt className="w-4 h-4" />
                )}
                <span>Dapatkan Invoice Instant</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
