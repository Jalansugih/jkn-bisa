import React, { useState, useEffect } from 'react';
import { AuthUser, OrderItem, Product, Article } from '../../types';
import { AdminTab, RfqItem, AdminUserListItem } from '../../types/admin';
import { AdminGuard } from './AdminGuard';
import { checkIsAdmin } from '../../lib/authService';
import { AdminLayout } from './AdminLayout';
import { AdminOverviewPage } from './AdminOverviewPage';
import { AdminOrdersPage } from './AdminOrdersPage';
import { AdminRfqPage } from './AdminRfqPage';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminArticlesPage } from './AdminArticlesPage';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminCommissionsPage } from './AdminCommissionsPage';
import {
  subscribeToAllOrders,
  subscribeToAllUsers,
} from '../../lib/adminService';
import { subscribeToRfqs } from '../../lib/rfqService';
import { subscribeToProducts } from '../../lib/productService';
import { subscribeToArticles } from '../../lib/articleService';

interface AdminDashboardProps {
  currentUser: AuthUser | null;
  products?: Product[];
  articles?: Article[];
  onOpenLogin: () => void;
  onLogout: () => void;
  onGoHome: () => void;
  onOpenOrder: (productKey: string) => void;
  onPreviewArticle?: (articleId: string) => void;
  showToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  products: initialProducts,
  articles: initialArticles,
  onOpenLogin,
  onLogout,
  onGoHome,
  onOpenOrder,
  onPreviewArticle,
  showToast,
}) => {
  const getAdminTabFromPath = (): AdminTab => {
    const segment = window.location.pathname.replace(/^\/admin\/?/, '').split('/')[0];
    const validTabs: AdminTab[] = ['overview', 'orders', 'rfq', 'products', 'articles', 'users', 'commissions'];
    return validTabs.includes(segment as AdminTab) ? (segment as AdminTab) : 'overview';
  };

  const [currentTab, setCurrentTab] = useState<AdminTab>(getAdminTabFromPath);

  const navigateAdminTab = (tab: AdminTab, replace = false) => {
    const path = tab === 'overview' ? '/admin' : `/admin/${tab}`;
    if (replace) {
      window.history.replaceState({}, '', path);
    } else if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleAdminLocation = () => {
      if (!window.location.pathname.startsWith('/admin')) return;
      setCurrentTab(getAdminTabFromPath());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handleAdminLocation);
    return () => window.removeEventListener('popstate', handleAdminLocation);
  }, []);

  // Order clicked from Overview's "Pesanan Terbaru" list, forwarded to the
  // Orders page so it opens directly in the edit modal instead of just
  // switching tabs.
  const [orderToOpen, setOrderToOpen] = useState<OrderItem | null>(null);

  // Real-time admin state collections
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [allRfqs, setAllRfqs] = useState<RfqItem[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUserListItem[]>([]);
  const [productsList, setProductsList] = useState<Product[]>(initialProducts || []);
  const [articlesList, setArticlesList] = useState<Article[]>(initialArticles || []);

  // Update local state if props change
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductsList(initialProducts);
    }
  }, [initialProducts]);

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setArticlesList(initialArticles);
    }
  }, [initialArticles]);

  // Subscriptions to Firestore collections
  useEffect(() => {
    // Do not attach admin Firestore listeners for guests/customers.
    // This avoids permission-denied noise and unnecessary reads before the guard
    // has confirmed that the current account is an administrator.
    if (!checkIsAdmin(currentUser)) {
      setAllOrders([]);
      setAllRfqs([]);
      setAllUsers([]);
      return;
    }

    const unsubOrders = subscribeToAllOrders(setAllOrders);
    const unsubRfqs = subscribeToRfqs(setAllRfqs);
    const unsubUsers = subscribeToAllUsers(setAllUsers);
    const unsubProducts = subscribeToProducts(setProductsList);
    const unsubArticles = subscribeToArticles(setArticlesList);

    return () => {
      unsubOrders();
      unsubRfqs();
      unsubUsers();
      unsubProducts();
      unsubArticles();
    };
  }, [currentUser]);

  return (
    <AdminGuard
      currentUser={currentUser}
      onOpenLogin={onOpenLogin}
      onGoHome={onGoHome}
    >
      <AdminLayout
        currentTab={currentTab}
        onSelectTab={(tab) => navigateAdminTab(tab)}
        currentUser={currentUser}
        onLogout={onLogout}
        onGoHome={onGoHome}
        ordersCount={allOrders.length}
        rfqsCount={allRfqs.length}
        usersCount={allUsers.length}
        productsCount={productsList.length}
        articlesCount={articlesList.length}
      >
        {currentTab === 'overview' && (
          <AdminOverviewPage
            orders={allOrders}
            rfqs={allRfqs}
            usersCount={allUsers.length}
            productsCount={productsList.length}
            articlesCount={articlesList.length}
            onNavigateTab={(tab) => navigateAdminTab(tab)}
            onSelectOrder={(ord) => {
              setOrderToOpen(ord);
              navigateAdminTab('orders');
            }}
          />
        )}

        {currentTab === 'orders' && (
          <AdminOrdersPage
            orders={allOrders}
            showToast={showToast}
            orderToOpen={orderToOpen}
            onOrderToOpenConsumed={() => setOrderToOpen(null)}
          />
        )}

        {currentTab === 'rfq' && (
          <AdminRfqPage rfqs={allRfqs} showToast={showToast} />
        )}

        {currentTab === 'products' && (
          <AdminProductsPage
            products={productsList}
            onOpenOrder={onOpenOrder}
            showToast={showToast}
          />
        )}

        {currentTab === 'articles' && (
          <AdminArticlesPage
            articles={articlesList}
            showToast={showToast}
            onPreviewArticle={onPreviewArticle}
          />
        )}

        {currentTab === 'users' && (
          <AdminUsersPage users={allUsers} currentUserId={currentUser?.id} showToast={showToast} />
        )}

        {currentTab === 'commissions' && <AdminCommissionsPage showToast={showToast} />}
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;

