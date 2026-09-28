import React, { useState, useEffect, useMemo } from 'react';
import { OrderItem, ToastMessage, RfqFormData, AuthUser, Product, Article } from './types';
import { subscribeToAuthChanges, logout } from './lib/authService';
import { createOrder, subscribeToMyOrders } from './lib/orderService';
import { subscribeToProducts } from './lib/productService';
import { subscribeToArticles } from './lib/articleService';
import { ARTICLES_DATA } from './data/mockData';
import { ARTICLE_BASE_PATH, articlePath, parseArticleSlug, slugify } from './lib/slug';

// Layout components
import { TopPromoBar } from './components/layout/TopPromoBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Common components
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { ToastContainer } from './components/common/ToastContainer';

// Home page section components
import { HeroSection } from './components/home/HeroSection';
import { SystemOverviewSection } from './components/home/SystemOverviewSection';
import { TrustBadgeBar } from './components/home/TrustBadgeBar';
import { PainPointsSection } from './components/home/PainPointsSection';
import { KategoriMarqueeSection } from './components/home/KategoriMarqueeSection';
import { BusinessMatrixSection } from './components/home/BusinessMatrixSection';
import { SolutionsGridSection } from './components/home/SolutionsGridSection';
import { ProductsSection } from './components/home/ProductsSection';
import { PricingSection } from './components/home/PricingSection';
import { WorkflowSection } from './components/home/WorkflowSection';
import { RfqFormSection } from './components/home/RfqFormSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { ArticlesSection } from './components/home/ArticlesSection';
import { FaqSection } from './components/home/FaqSection';

// Articles Pages
import { ArticlesHubPage } from './components/articles/ArticlesHubPage';
import { SingleArticlePage } from './components/articles/SingleArticlePage';

// Dashboard component
import UserDashboard from './components/dashboard/UserDashboard';


// Service Pages (Jasa & Solusi)
import { DigitalServicePage } from './components/services/DigitalServicePage';
import { LegalitasServicePage } from './components/services/LegalitasServicePage';
import { KonstruksiServicePage } from './components/services/KonstruksiServicePage';
import { AgroServicePage } from './components/services/AgroServicePage';
import { ServicePageKey } from './components/services/ServiceNavTabs';

// Modals
import { OrderModal } from './components/modals/OrderModal';
import { InvoiceModal } from './components/modals/InvoiceModal';
import { OrderTrackerModal } from './components/modals/OrderTrackerModal';
import { ArticleModal } from './components/modals/ArticleModal';
import { ConsultationModal } from './components/modals/ConsultationModal';
import { MyOrdersModal } from './components/modals/MyOrdersModal';
import { CareerModal } from './components/modals/CareerModal';
import { TermsModal } from './components/modals/TermsModal';
import { PrivacyModal } from './components/modals/PrivacyModal';
import { RfqModal } from './components/modals/RfqModal';
import { AuthModal } from './components/modals/AuthModal';
import { ResetPasswordModal } from './components/modals/ResetPasswordModal';

export const App: React.FC = () => {
  // Modal states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedProductKey, setSelectedProductKey] = useState<string>('website_pro');

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [currentInvoiceOrder, setCurrentInvoiceOrder] = useState<OrderItem | null>(null);

  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState<boolean>(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState<boolean>(false);
  const [isMyOrdersModalOpen, setIsMyOrdersModalOpen] = useState<boolean>(false);
  const [isRfqModalOpen, setIsRfqModalOpen] = useState<boolean>(false);
  const [isCareerModalOpen, setIsCareerModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Auth / Registration modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');

  // Password recovery modal - opened automatically when Supabase detects a
  // valid "forgot password" recovery link (see authService.ts, event
  // 'binausaha:password-recovery').
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState<boolean>(false);

  // Authenticated user state, synced in real time from Supabase Auth (see useEffect below)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authUid, setAuthUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setAuthUid(user?.id || null);
    });
    return unsubscribe;
  }, []);

  // Open the "set new password" modal when the user arrives via a
  // password-recovery email link.
  useEffect(() => {
    const handlePasswordRecovery = () => setIsResetPasswordModalOpen(true);
    window.addEventListener('binausaha:password-recovery', handlePasswordRecovery);
    return () => window.removeEventListener('binausaha:password-recovery', handlePasswordRecovery);
  }, []);

  const [selectedArticleKey, setSelectedArticleKey] = useState<string>('art_1');
  // Slug dari URL (/artikel/<slug>) — sumber kebenaran untuk halaman detail artikel
  const [articleSlug, setArticleSlug] = useState<string | null>(() => parseArticleSlug(window.location.pathname));
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  // Public pages remain state-driven. The dedicated /admin entry is mounted by main.tsx.
  const [currentView, setCurrentView] = useState<
    'home' | 'articles' | 'article-detail' | 'service-digital' | 'service-legalitas' | 'service-konstruksi' | 'service-agro' | 'dashboard' | 'admin'
>(() => {
    const path = window.location.pathname;
    if (parseArticleSlug(path)) return 'article-detail';
    if (path === ARTICLE_BASE_PATH || path === ARTICLE_BASE_PATH + '/') return 'articles';
    return 'home';
  });

  const navigateAppPath = (path: string, replace = false) => {
    if (replace) window.history.replaceState({}, '', path);
    else window.history.pushState({}, '', path);
    setCurrentView(path === '/admin' || path.startsWith('/admin/') ? 'admin' : 'home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Selected product filter for smooth jumps
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Service sub-tab and scroll target
  const [serviceSubTab, setServiceSubTab] = useState<string | undefined>(undefined);
  const [serviceScrollTarget, setServiceScrollTarget] = useState<string | undefined>(undefined);

  // Bookmarks state with localStorage persistence
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bu_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Articles category filter state for direct navigation from menu
  const [articlesCategoryFilter, setArticlesCategoryFilter] = useState<string>('all');

  // Orders state: real-time subscription to the signed-in user's own orders
  // stored in Firestore (see src/lib/orderService.ts). Empty for guests.
  const [orders, setOrders] = useState<OrderItem[]>([]);

  // Products and Articles real-time sync states
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  // Halaman publik hanya boleh menampilkan artikel PUBLISHED
  const publicArticles = useMemo(
    () => articles.filter((a) => (a.status || 'PUBLISHED') === 'PUBLISHED'),
    [articles]
  );

  // Artikel yang sedang dibuka, dicari berdasarkan slug di URL
  const slugArticle = useMemo(() => {
    if (!articleSlug) return null;
    const pool = publicArticles.length > 0 ? publicArticles : Object.values(ARTICLES_DATA);
    return pool.find((a) => (a.slug || slugify(a.title)) === articleSlug) || null;
  }, [articleSlug, publicArticles]);

  useEffect(() => {
    if (slugArticle) setSelectedArticleKey(slugArticle.id);
  }, [slugArticle]);

  // Sinkronkan URL <-> tampilan (tombol back/forward browser)
  useEffect(() => {
    const syncFromPath = () => {
      const path = window.location.pathname;
      const slug = parseArticleSlug(path);
      if (slug) {
        setArticleSlug(slug);
        setCurrentView('article-detail');
      } else if (path === ARTICLE_BASE_PATH || path === ARTICLE_BASE_PATH + '/') {
        setCurrentView('articles');
      } else if (path === '/') {
        setCurrentView('home');
      }
    };
    window.addEventListener('popstate', syncFromPath);
    return () => window.removeEventListener('popstate', syncFromPath);
  }, []);

  // Tulis URL sesuai tampilan aktif
  useEffect(() => {
    if (currentView === 'admin') return;
    let target: string | null = null;
    if (currentView === 'article-detail') {
      target = slugArticle ? articlePath(slugArticle.slug || slugify(slugArticle.title)) : null;
    } else if (currentView === 'articles') {
      target = ARTICLE_BASE_PATH;
    } else if (window.location.pathname.startsWith(ARTICLE_BASE_PATH)) {
      target = '/'; // keluar dari area artikel
    }
    if (target && window.location.pathname !== target) {
      window.history.pushState({}, '', target);
    }
  }, [currentView, slugArticle]);

  // Judul tab browser
  useEffect(() => {
    if (currentView === 'article-detail' && slugArticle) {
      document.title = `${slugArticle.title} | BinaUsaha`;
    } else if (currentView === 'articles') {
      document.title = 'Artikel & Tips Bisnis UMKM | BinaUsaha';
    } else {
      document.title = 'BinaUsaha - Platform Digital UMKM Indonesia';
    }
  }, [currentView, slugArticle]);

  useEffect(() => {
    const unsubscribe = subscribeToMyOrders(authUid, setOrders);
    return unsubscribe;
  }, [authUid]);

  useEffect(() => {
    const unsubProducts = subscribeToProducts(setProducts);
    const unsubArticles = subscribeToArticles(setArticles);
    return () => {
      unsubProducts();
      unsubArticles();
    };
  }, []);

  // Toast Notification State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save bookmarks
  const toggleBookmark = (artId: string) => {
    setBookmarkedArticles((prev) => {
      let updated: string[];
      if (prev.includes(artId)) {
        updated = prev.filter((id) => id !== artId);
        showToast('Artikel dihapus dari favorit', 'info');
      } else {
        updated = [...prev, artId];
        showToast('Artikel disimpan ke favorit!', 'success');
      }
      try {
        localStorage.setItem('bu_bookmarks', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Order Handlers
  const handleOpenOrder = (prodKey: string) => {
    setSelectedProductKey(prodKey);
    setIsOrderModalOpen(true);
  };

  const handleOrderCompleted = async (
    orderDraft: Omit<OrderItem, 'id' | 'date' | 'status'>,
    method: 'whatsapp' | 'online'
  ) => {
    let newOrder: OrderItem;
    try {
      newOrder = await createOrder(orderDraft, authUid);
    } catch (err) {
      console.error('[handleOrderCompleted] Checkout gagal:', err);
      showToast(
        err instanceof Error && err.message
          ? err.message
          : 'Gagal menyimpan pesanan. Silakan coba lagi.',
        'error'
      );
      return;
    }

    setIsOrderModalOpen(false);

    if (method === 'online') {
      setCurrentInvoiceOrder(newOrder);
      setIsInvoiceModalOpen(true);
      showToast('Pesanan berhasil dibuat & tersimpan! Silakan transfer pembayaran.', 'success');
    } else {
      showToast('Pesanan tersimpan! Membuka WhatsApp untuk konfirmasi...', 'success');
      const text = `Halo BinaUsaha, saya ingin melakukan pemesanan paket:\n\n*Order ID:* ${newOrder.id}\n*Paket:* ${newOrder.product}\n*Brand Usaha:* ${newOrder.brand}\n*Nama:* ${newOrder.name}\n*No. WA:* ${newOrder.wa}\n*Total Tagihan:* ${newOrder.total}\n\nMohon petunjuk invoice dan pengerjaan selanjutnya. Terima kasih!`;
      window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  // WhatsApp quick trigger
  const handleAskWhatsapp = (queryTopic: string) => {
    const text = `Halo BinaUsaha, saya tertarik dengan layanan *${queryTopic}*. Mohon informasi dan konsultasinya.`;
    window.open(`https://wa.me/6285195979888?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Article handler - navigate directly to single article page
  const handleOpenArticle = (artKey: string) => {
    const art = articles.find((a) => a.id === artKey) || ARTICLES_DATA[artKey];
    setSelectedArticleKey(artKey);
    setArticleSlug(art ? art.slug || slugify(art.title) : null);
    setCurrentView('article-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Articles Hub handler - navigate to hub with specific category
  const handleOpenArticlesHub = (category: string = 'all') => {
    setArticlesCategoryFilter(category);
    setCurrentView('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search handler from Hero section
  const handleHeroSearch = (keyword: string) => {
    setCurrentView('home');
    setSearchQuery(keyword);
    setProductCategoryFilter('all');

    setTimeout(() => {
      const el = document.getElementById('produk');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);

    if (keyword.trim()) {
      showToast(`Mencari solusi: "${keyword}"`, 'info');
    }
  };

  // Auth handlers
  const handleOpenRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleOpenLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  // Supabase's onAuthStateChange (subscribed above) will update currentUser
  // automatically; here we just react with a toast once the modal reports success.
  const handleAuthSuccess = (_user: AuthUser, message: string) => {
    showToast(message, 'success');
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Anda telah keluar dari akun.', 'info');
    } catch (err) {
      showToast('Gagal keluar dari akun. Silakan coba lagi.', 'error');
    }
  };

  // Service navigation handler
  const handleNavigateService = (
    serviceKey: ServicePageKey,
    targetTab?: string,
    scrollTarget?: string
  ) => {
    setServiceSubTab(targetTab);
    setServiceScrollTarget(scrollTarget);
    if (serviceKey === 'digital') setCurrentView('service-digital');
    else if (serviceKey === 'legalitas') setCurrentView('service-legalitas');
    else if (serviceKey === 'konstruksi') setCurrentView('service-konstruksi');
    else if (serviceKey === 'agro') setCurrentView('service-agro');
    
    if (!scrollTarget) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // RFQ Submission
  const handleRfqSubmitted = (formData: RfqFormData) => {
    showToast(`Pengajuan ${formData.kategori} terkirim! Tim kami akan menghubungi Anda.`, 'success');
  };

  // Copy BCA
  const handleCopyBca = () => {
    navigator.clipboard.writeText('4020322841');
    showToast('Nomor Rekening BCA 4020322841 disalin!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Top Banner */}
      {currentView !== 'admin' && (
        <TopPromoBar onSelectPtPro={() => handleOpenOrder('pt_pro')} />
      )}

      {/* Navigation Header */}
      {currentView !== 'admin' && (
        <Navbar
          onOpenRfqModal={() => setIsRfqModalOpen(true)}
          onOpenRegisterModal={handleOpenRegister}
          onOpenOrderTracker={() => setIsTrackerModalOpen(true)}
          onOpenMyOrders={() => setIsMyOrdersModalOpen(true)}
          onOpenCareerModal={() => setIsCareerModalOpen(true)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenDashboard={() => {
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAdmin={() => navigateAppPath('/admin')}
          onOpenServicePage={handleNavigateService}
          onSelectNeedCategory={(cat) => {
            setCurrentView('home');
            setSearchQuery('');
            setProductCategoryFilter(cat);
            const el = document.getElementById('produk');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onFilterProductsCategory={(cat) => {
            setCurrentView('home');
            setSearchQuery('');
            setProductCategoryFilter(cat);
            const el = document.getElementById('produk');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          orderCount={orders.length}
          onOpenArticlesHub={(cat) => handleOpenArticlesHub(cat || 'all')}
          onOpenArticle={handleOpenArticle}
          onGoHome={() => {
            setCurrentView('home');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 text-center">
              <p className="font-semibold text-slate-800">Membuka Panel Admin…</p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold" onClick={() => window.location.assign('/admin')}>Buka /admin</button>
            </div>
          </div>
        ) : currentView === 'dashboard' ? (
          <UserDashboard
            user={
              currentUser
                ? {
                    displayName: currentUser.name,
                    email: currentUser.email,
                    photoURL: currentUser.avatar,
                    businessName: currentUser.businessName,
                    whatsapp: currentUser.whatsapp,
                  }
                : null
            }
            orders={orders}
            onGoHome={() => navigateAppPath('/')}
            onOpenOrder={(serviceId) => {
              if (serviceId) {
                handleOpenOrder(serviceId);
              }
            }}
            onOpenTracker={() => setIsTrackerModalOpen(true)}
            onSelectOrderInvoice={(order) => {
              setCurrentInvoiceOrder(order);
              setIsInvoiceModalOpen(true);
            }}
          />
        ) : currentView === 'article-detail' && !slugArticle ? (
          <div className="min-h-[60vh] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h1 className="text-xl font-bold text-slate-800">Artikel tidak ditemukan</h1>
              <p className="mt-2 text-sm text-slate-500">
                Artikel mungkin sedang dimuat, sudah dihapus, atau alamatnya berubah.
              </p>
              <button
                className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold cursor-pointer"
                onClick={() => handleOpenArticlesHub('all')}
              >
                Lihat semua artikel
              </button>
            </div>
          </div>
        ) : currentView === 'article-detail' ? (
          <SingleArticlePage
            articleId={selectedArticleKey}
            articles={publicArticles}
            products={products}
            onBackToArticles={() => {
              handleOpenArticlesHub(articlesCategoryFilter || 'all');
            }}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectArticle={handleOpenArticle}
            onToggleBookmark={toggleBookmark}
            bookmarkedArticles={bookmarkedArticles}
            onOpenOrder={handleOpenOrder}
            onOpenConsultation={() => setIsConsultModalOpen(true)}
            onAskWhatsapp={handleAskWhatsapp}
            showToast={showToast}
          />
        ) : currentView === 'articles' ? (
          <ArticlesHubPage
            articles={publicArticles}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenArticle={handleOpenArticle}
            onToggleBookmark={toggleBookmark}
            bookmarkedArticles={bookmarkedArticles}
            onOpenConsultation={() => setIsConsultModalOpen(true)}
            onAskWhatsapp={handleAskWhatsapp}
            showToast={showToast}
            initialCategory={articlesCategoryFilter}
          />
        ) : currentView === 'service-digital' ? (
          <DigitalServicePage
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectService={handleNavigateService}
            onOpenOrder={handleOpenOrder}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenConsultation={() => setIsConsultModalOpen(true)}
            onAskWhatsapp={handleAskWhatsapp}
            showToast={showToast}
            initialTab={serviceSubTab}
            scrollTarget={serviceScrollTarget}
          />
        ) : currentView === 'service-legalitas' ? (
          <LegalitasServicePage
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectService={handleNavigateService}
            onOpenOrder={handleOpenOrder}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenConsultation={() => setIsConsultModalOpen(true)}
            onAskWhatsapp={handleAskWhatsapp}
            showToast={showToast}
            initialTab={serviceSubTab}
            scrollTarget={serviceScrollTarget}
          />
        ) : currentView === 'service-konstruksi' ? (
          <KonstruksiServicePage
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectService={handleNavigateService}
            onOpenOrder={handleOpenOrder}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenConsultation={() => setIsConsultModalOpen(true)}
            onAskWhatsapp={handleAskWhatsapp}
            showToast={showToast}
            initialTab={serviceSubTab}
            scrollTarget={serviceScrollTarget}
          />
        ) : currentView === 'service-agro' ? (
          <AgroServicePage
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectService={handleNavigateService}
            onOpenOrder={handleOpenOrder}
            onOpenRfq={() => setIsRfqModalOpen(true)}
            onOpenConsultation={() => setIsConsultModalOpen(true)}
            onAskWhatsapp={handleAskWhatsapp}
            showToast={showToast}
            initialTab={serviceSubTab}
            scrollTarget={serviceScrollTarget}
          />
        ) : (
          <>
            {/* 1. Hero Section */}
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenRfqModal={() => setIsRfqModalOpen(true)}
              onSelectCategory={(cat) => {
                setSearchQuery('');
                setProductCategoryFilter(cat);
                const el = document.getElementById('produk');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenOrderPtPro={() => handleOpenOrder('pt_pro')}
              onOpenConsultation={() => setIsConsultModalOpen(true)}
              onOpenOrderTrack={() => setIsTrackerModalOpen(true)}
            />

            {/* 2. System Overview Dashboard Section */}
            <SystemOverviewSection onSelectProduct={handleOpenOrder} />

            {/* 3. Trust Badge Bar */}
            <TrustBadgeBar />

            {/* 4. Pain Points Section */}
            <PainPointsSection onOpenConsultation={() => setIsConsultModalOpen(true)} />

            {/* 5. Kategori Marquee */}
            <KategoriMarqueeSection
              onSelectCategory={(cat) => {
                setSearchQuery('');
                setProductCategoryFilter(cat);
                const el = document.getElementById('produk');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 6. Business Phase Matrix */}
            <BusinessMatrixSection onSelectProduct={handleOpenOrder} />

            {/* 7. Solutions Grid Section */}
            <SolutionsGridSection onSelectProduct={handleOpenOrder} />

            {/* 8. Products & Services Catalog Section */}
            <ProductsSection
              products={products}
              initialCategory={productCategoryFilter}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
              onSelectProductOrder={handleOpenOrder}
              onAskWhatsapp={handleAskWhatsapp}
            />

            {/* 9. Pricing Tiers Section */}
            <PricingSection onSelectProduct={handleOpenOrder} />

            {/* 10. Workflow 5-Steps Section */}
            <WorkflowSection onOpenRfqModal={() => setIsRfqModalOpen(true)} />

            {/* 11. Interactive RFQ Form Section */}
            <RfqFormSection onSubmitSuccess={handleRfqSubmitted} />

            {/* 12. Client Testimonials Section */}
            <TestimonialsSection />

            {/* 13. Articles & Insights Section */}
            <ArticlesSection
              articles={publicArticles}
              onOpenArticle={handleOpenArticle}
              onToggleBookmark={toggleBookmark}
              bookmarkedArticles={bookmarkedArticles}
              onViewAllArticles={() => handleOpenArticlesHub('all')}
            />

            {/* 14. FAQ Section & Final High-Converting CTA Banner */}
            <FaqSection
              onAskWhatsapp={handleAskWhatsapp}
              onOpenConsultation={() => setIsConsultModalOpen(true)}
              onSelectProduct={handleOpenOrder}
            />
          </>
        )}
      </main>

      {/* Footer */}
      {currentView !== 'admin' && (
        <Footer
          onOpenOrderTracker={() => setIsTrackerModalOpen(true)}
          onOpenConsultation={() => setIsConsultModalOpen(true)}
          onOpenTerms={() => setIsTermsModalOpen(true)}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenServicePage={handleNavigateService}
          onSelectProduct={(key) => {
            setCurrentView('home');
            handleOpenOrder(key);
          }}
          onOpenArticlesHub={(cat) => handleOpenArticlesHub(cat || 'all')}
          onOpenAdmin={() => navigateAppPath('/admin')}
        />
      )}

      {/* Floating Elements */}
      <FloatingWhatsApp />
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />

      {/* Modals */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        productKey={selectedProductKey}
        products={products}
        onOrderCompleted={handleOrderCompleted}
        showToast={showToast}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={currentInvoiceOrder}
        onCopyBca={handleCopyBca}
      />

      <OrderTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        orders={orders}
      />

      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        articleKey={selectedArticleKey}
        articles={articles}
      />

      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        showToast={showToast}
      />

      <MyOrdersModal
        isOpen={isMyOrdersModalOpen}
        onClose={() => setIsMyOrdersModalOpen(false)}
        orders={orders}
        onOpenOrderTrack={() => setIsTrackerModalOpen(true)}
      />

      <RfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        onSubmitSuccess={handleRfqSubmitted}
      />

      <CareerModal
        isOpen={isCareerModalOpen}
        onClose={() => setIsCareerModalOpen(false)}
      />

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSuccess={(message) => showToast(message, 'success')}
      />
    </div>
  );
};

export default App;
