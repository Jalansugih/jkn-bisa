import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: string | null;
}

/**
 * Global safety net for the whole app.
 *
 * Sebelumnya, kalau ada error JavaScript yang tidak tertangani di mana pun
 * dalam pohon komponen (misalnya saat checkout produk tertentu), React akan
 * meng-unmount seluruh aplikasi dan pengguna hanya melihat halaman putih
 * kosong tanpa pesan apa pun.
 *
 * Dengan ErrorBoundary ini:
 * 1. Error tetap ditangkap & dicatat ke console (jadi bisa di-debug lewat
 *    DevTools > Console, atau dikirim ke error tracking di masa depan).
 * 2. Pengguna tetap melihat UI yang informatif, bukan layar kosong, dan bisa
 *    mencoba lagi atau reload tanpa kehilangan konteks sepenuhnya.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    info: null,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Selalu log ke console supaya error asli bisa dilihat & dilaporkan,
    // alih-alih hilang begitu saja di balik halaman blank.
    console.error('[ErrorBoundary] Terjadi error yang tidak tertangani:', error, errorInfo);
    this.setState({ info: errorInfo.componentStack || null });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl shadow-xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 text-2xl font-bold">
              !
            </div>
            <h1 className="font-heading font-bold text-lg text-slate-900">
              Terjadi Kesalahan Teknis
            </h1>
            <p className="text-sm text-slate-500">
              Maaf, terjadi kesalahan yang tidak terduga saat memproses halaman ini
              (kemungkinan besar saat checkout). Tim kami butuh detail teknis di
              bawah ini untuk memperbaikinya.
            </p>

            {this.state.error && (
              <div className="text-left bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-auto max-h-48">
                <p className="text-xs font-mono text-rose-700 break-words">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.info && (
                  <pre className="text-[10px] text-slate-400 mt-2 whitespace-pre-wrap break-words">
                    {this.state.info}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer transition"
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
