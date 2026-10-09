import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthUser, OrderItem, Product, Article } from '../../types';
import { AdminSeed, AdminTab, RfqItem, AdminUserListItem } from '../../types/admin';
import { AdminGuard } from './AdminGuard';
import { checkIsAdmin } from '../../lib/authService';
import { AdminLayout, NavBadge } from './AdminLayout';
import { AdminGlobalSearch, AdminNotificationBell } from './AdminHeaderTools';
import { AdminOverviewPage } from './AdminOverviewPage';
import { AdminOrdersPage } from './AdminOrdersPage';
import { AdminRfqPage } from './AdminRfqPage';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminArticlesPage } from './AdminArticlesPage';
import { AdminUsersPage } from './AdminUsersPage';
import { AdminCommissionsPage } from './AdminCommissionsPage';
import { subscribeToAllOrders, subscribeToAllUsers } from '../../lib/adminService';
import { subscribeToRfqs } from '../../lib/rfqService';
import { subscribeToProducts } from '../../lib/productService';
import { subscribeToArticles } from '../../lib/articleService';
import { AdminPayout, adminFetchPayouts } from '../../lib/payoutService';
import { fetchRevenueTarget } from '../../lib/revenueTarget';
import { buildActionItems, countOrders, summarizePayouts } from '../../lib/adminAnalytics';
import { formatRupiah } from '../../lib/adminUtils';

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

const VALID_TABS: AdminTab[] = ['overview', 'orders', 'rfq', 'products', 'articles', 'users', 'commissions'];

/** Jeda pembaruan data pencairan (tabelnya tidak punya langganan realtime). */
const PAYOUT_REFRESH_MS = 60_000;

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
    return VALID_TABS.includes(segment as AdminTab) ? (segment as AdminTab) : 'overview';
  };

  const [currentTab, setCurrentTab] = useState<AdminTab>(getAdminTabFromPath);

  /**
   * Perintah dari pencarian global / lonceng / kartu: membuka menu tujuan sekaligus
   * mengisi filter, pencarian, atau langsung membuka item. Diambil (dikonsumsi) sekali
   * oleh halaman tujuan lalu dikosongkan, supaya tidak terpicu ulang.
   */
  const [seed, setSeed] = useState<AdminSeed | null>(null);
  const consumeSeed = useCallback(() => setSeed(null), []);

  const goToTab = (tab: AdminTab, replace = false) => {
    const path = tab === 'overview' ? '/admin' : `/admin/${tab}`;
    if (replace) {
      window.history.replaceState({}, '', path);
    } else if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    setCurrentTab(tab);
  };

  /** Klik menu biasa: buka tab, buang filter lama. */
  const navigateAdminTab = (tab: AdminTab) => {
    setSeed(null);
    goToTab(tab);
  };

  /** Pindah dengan tujuan spesifik. */
  const navigateWithSeed = (next: AdminSeed) => {
    setSeed(next);
    goToTab(next.tab);
  };

  useEffect(() => {
    const handleAdminLocation = () => {
      if (!window.location.pathname.startsWith('/admin')) return;
      setCurrentTab(getAdminTabFromPath());
    };
    window.addEventListener('popstate', handleAdminLocation);
    return () => window.removeEventListener('popstate', handleAdminLocation);
  }, []);

  // Koleksi data realtime
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [allRfqs, setAllRfqs] = useState<RfqItem[]>([]);
  const [allUsers, setAllUsers] = useState<AdminUserListItem[]>([]);
  const [productsList, setProductsList] = useState<Product[]>(initialProducts || []);
  const [articlesList, setArticlesList] = useState<Article[]>(initialArticles || []);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [revenueTarget, setRevenueTarget] = useState<number | null>(null);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) setProductsList(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) setArticlesList(initialArticles);
  }, [initialArticles]);

  const isAdmin = checkIsAdmin(currentUser);

  // Langganan data Supabase. Tidak dipasang untuk tamu/customer supaya tidak ada
  // error izin dan pembacaan yang sia-sia sebelum AdminGuard memastikan akun admin.
  useEffect(() => {
    if (!isAdmin) {
      setAllOrders([]);
      setOrdersLoaded(false);
      setAllRfqs([]);
      setAllUsers([]);
      return;
    }

    const unsubOrders = subscribeToAllOrders((list) => {
      setAllOrders(list);
      setOrdersLoaded(true);
    });
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
  }, [isAdmin, currentUser?.id]);

  // Pencairan komisi + target omset
  const refreshPayouts = useCallback(async () => {
    try {
      setPayouts(await adminFetchPayouts());
    } catch (e) {
      // Tabel commission_payouts baru ada setelah migrasinya dijalankan; menu Komisi menampilkan pesannya.
      console.warn('[AdminDashboard] Pencairan belum bisa dimuat:', e);
      setPayouts([]);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setPayouts([]);
      return;
    }
    refreshPayouts();
    fetchRevenueTarget().then(setRevenueTarget);
    const timer = window.setInterval(refreshPayouts, PAYOUT_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [isAdmin, currentUser?.id, refreshPayouts]);

  const orderCounts = useMemo(() => countOrders(allOrders), [allOrders]);
  const payoutSummary = useMemo(() => summarizePayouts(payouts), [payouts]);
  const actionItems = useMemo(
    () => buildActionItems(allOrders, allRfqs, payouts, formatRupiah),
    [allOrders, allRfqs, payouts]
  );

  const badges: Partial<Record<AdminTab, NavBadge>> = {
    orders: { value: orderCounts.verify + orderCounts.queue, tone: 'action' },
    rfq: { value: allRfqs.filter((r) => r.status === 'Baru').length, tone: 'action' },
    products: { value: productsList.length, tone: 'muted' },
    articles: { value: articlesList.length, tone: 'muted' },
    users: { value: allUsers.length, tone: 'muted' },
    commissions: { value: payoutSummary.requestedCount, tone: 'action' },
  };

  const handlePreviewArticle = (articleId: string) => {
    const article = articlesList.find((a) => a.id === articleId);
    if (article?.slug && (article.status || 'PUBLISHED') === 'PUBLISHED') {
      window.open(`/artikel/${article.slug}`, '_blank', 'noopener');
      return;
    }
    onPreviewArticle?.(articleId);
  };

  const seedFor = (tab: AdminTab) => (seed && seed.tab === tab ? seed : null);

  return (
    <AdminGuard currentUser={currentUser} onOpenLogin={onOpenLogin} onGoHome={onGoHome}>
      <AdminLayout
        currentTab={currentTab}
        onSelectTab={navigateAdminTab}
        currentUser={currentUser}
        onLogout={onLogout}
        onGoHome={onGoHome}
        badges={badges}
        headerExtras={
          <>
            <AdminGlobalSearch
              orders={allOrders}
              rfqs={allRfqs}
              users={allUsers}
              products={productsList}
              articles={articlesList}
              onNavigate={navigateWithSeed}
            />
            <AdminNotificationBell items={actionItems} onNavigate={navigateWithSeed} />
          </>
        }
      >
        {currentTab === 'overview' && (
          <AdminOverviewPage
            orders={allOrders}
            rfqs={allRfqs}
            users={allUsers}
            payouts={payouts}
            products={productsList}
            articles={articlesList}
            ordersLoaded={ordersLoaded}
            revenueTarget={revenueTarget}
            onTargetChanged={setRevenueTarget}
            onNavigate={navigateWithSeed}
            showToast={showToast}
          />
        )}

        {currentTab === 'orders' && (
          <AdminOrdersPage
            orders={allOrders}
            ordersLoaded={ordersLoaded}
            showToast={showToast}
            seed={seedFor('orders')}
            onSeedConsumed={consumeSeed}
          />
        )}

        {currentTab === 'rfq' && (
          <AdminRfqPage rfqs={allRfqs} showToast={showToast} seed={seedFor('rfq')} onSeedConsumed={consumeSeed} />
        )}

        {currentTab === 'products' && (
          <AdminProductsPage
            products={productsList}
            onOpenOrder={onOpenOrder}
            showToast={showToast}
            seed={seedFor('products')}
            onSeedConsumed={consumeSeed}
          />
        )}

        {currentTab === 'articles' && (
          <AdminArticlesPage
            articles={articlesList}
            showToast={showToast}
            onPreviewArticle={handlePreviewArticle}
            seed={seedFor('articles')}
            onSeedConsumed={consumeSeed}
          />
        )}

        {currentTab === 'users' && (
          <AdminUsersPage
            users={allUsers}
            orders={allOrders}
            currentUserId={currentUser?.id}
            showToast={showToast}
            seed={seedFor('users')}
            onSeedConsumed={consumeSeed}
          />
        )}

        {currentTab === 'commissions' && (
          <AdminCommissionsPage showToast={showToast} onDataChanged={refreshPayouts} />
        )}
      </AdminLayout>
    </AdminGuard>
  );
};

export default AdminDashboard;
