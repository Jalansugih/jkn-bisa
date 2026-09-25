import React, { useState } from 'react';
import { PackageSearch, X, CheckCircle2, Clock, Circle, Loader2, AlertTriangle } from 'lucide-react';
import { OrderItem } from '../../types';
import { trackOrder } from '../../lib/orderService';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders?: OrderItem[];
}

const STATUS_STEP: Record<OrderItem['status'], number> = {
  Verifikasi: 1,
  Pengerjaan: 2,
  'QC & Training': 3,
  Selesai: 4,
};

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<OrderItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery || searchInput).trim();
    if (!q) return;
    setIsSearching(true);
    setErrorMsg(null);
    try {
      const found = await trackOrder(q);
      setSearchedOrder(found);
      if (!found) {
        setErrorMsg('Pesanan tidak ditemukan. Periksa kembali Order ID atau nomor WhatsApp Anda.');
      }
    } catch (err: any) {
      console.error('Track order error:', err);
      setSearchedOrder(null);
      setErrorMsg('Gagal menghubungi server pelacakan. Silakan periksa koneksi internet Anda.');
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const currentStep = searchedOrder ? STATUS_STEP[searchedOrder.status] || 1 : 0;

  return (
    <div
      id="orderTrackerModal"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl flex items-center justify-center font-bold shadow-xs">
            <PackageSearch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">Cek Status Pesanan</h3>
            <p className="text-xs text-slate-500">Masukkan Order ID atau No. WhatsApp Anda</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              id="trackInput"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
              placeholder="Contoh: BU-123456789 atau 0812..."
            />
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-blue-600/20 disabled:opacity-60 flex items-center gap-1.5"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Cari</span>
            </button>
          </div>

          {hasSearched && errorMsg && (
            <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl p-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {hasSearched && searchedOrder && (
            <div id="trackResultBox" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-200 pb-2">
                <div>
                  <span className="font-bold text-slate-900 block">{searchedOrder.brand}</span>
                  <span className="text-[11px] text-slate-500">{searchedOrder.id} • {searchedOrder.product}</span>
                </div>
                <span className="bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2.5 py-1 rounded-full text-[10px] self-start shadow-xs">
                  {searchedOrder.status}
                </span>
              </div>

              {/* Stepper progress, driven by the real order status */}
              <div className="space-y-2.5 text-xs pt-1">
                {[
                  '1. Pesanan Diterima & Verifikasi Pembayaran',
                  '2. Dalam Pengerjaan Tim Teknis & Legalitas',
                  '3. QC & Pelatihan Penggunaan / Penyerahan Draft',
                  '4. Serah Terima Layanan Selesai & Garansi Aktif',
                ].map((label, idx) => {
                  const step = idx + 1;
                  const done = step < currentStep;
                  const active = step === currentStep;
                  return (
                    <div
                      key={label}
                      className={`flex items-center gap-2 font-semibold ${
                        done ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : active ? (
                        <Clock className="w-4 h-4 animate-spin text-blue-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>

              {searchedOrder.notes && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-800 block">Catatan Tim:</span>
                  {searchedOrder.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
