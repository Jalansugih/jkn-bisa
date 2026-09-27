import React, { useEffect, useState } from 'react';
import { AuthUser } from './types';
import { subscribeToAuthChanges, logout } from './lib/authService';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/modals/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ToastMessage } from './types';

/**
 * Dedicated Admin Portal entry point.
 * It is intentionally separate from the public App so /admin is not just
 * another public-page state. AdminDashboard owns the admin navigation and
 * data subscriptions.
 */
export const AdminApp: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return subscribeToAuthChanges(setCurrentUser);
  }, []);

  const showToast = (msg: string, type: ToastMessage['type'] = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message: msg, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    showToast('Anda telah keluar dari Panel Admin.', 'success');
  };

  const goHome = () => {
    window.location.assign('/');
  };

  const openOrder = (_productKey: string) => {
    showToast('Pratinjau pesanan dari katalog dibuka melalui website utama.', 'info');
  };

  const previewArticle = (_articleId: string) => {
    showToast('Pratinjau artikel tersedia melalui website utama.', 'info');
  };

  return (
    <>
      <AdminDashboard
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onGoHome={goHome}
        onOpenOrder={openOrder}
        onPreviewArticle={previewArticle}
        showToast={showToast}
      />

      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialMode="login"
        onAuthSuccess={(user, message) => {
          setCurrentUser(user);
          showToast(message, 'success');
          setIsLoginOpen(false);
        }}
      />

      <ToastContainer toasts={toasts} onCloseToast={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </>
  );
};

export default AdminApp;
