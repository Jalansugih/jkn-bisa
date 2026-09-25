import React, { useState, useEffect } from 'react';
import { OrderItem, ToastMessage, RfqFormData, AuthUser, Product, Article } from './types';
import { subscribeToAuthChanges, logout as firebaseLogout } from './lib/authService';
import { createOrder, subscribeToMyOrders } from './lib/orderService';
import { subscribeToProducts } from './lib/productService';
import { subscribeToArticles } from './lib/articleService';
import { isSupabaseConfigured } from './lib/supabase';

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

// Admin Portal Dashboard
import { AdminDashboard } from './components/admin/AdminDashboard';

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

  const [selectedArticleKey, setSelectedArticleKey] = useState<string>('art_1');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState<boolean>(false);

  // View state: 'home' | 'articles' | 'article-detail' | 'service-digital' | 'service-legalitas' | 'service-konstruksi' | 'service-agro' | 'dashboard' | 'admin'
  const [currentView, setCurrentView] = useState<
    'home' | 'articles' | 'article-detail' | 'service-digital' | 'service-legalitas' | 'service-konstruksi' | 'service-agro' | 'dashboard' | 'admin'
  >('home');

  // Listen to hash changes (e.g. #admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    setSelectedArticleKey(artKey);
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
      await firebaseLogout();
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
          onOpenAdmin={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
          <AdminDashboard
            currentUser={currentUser}
            products={products}
            articles={articles}
            onOpenLogin={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            onLogout={handleLogout}
            onGoHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenOrder={(serviceId) => {
              if (serviceId) {
                handleOpenOrder(serviceId);
              }
            }}
            onPreviewArticle={handleOpenArticle}
            showToast={showToast}
          />
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
            onGoHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
        ) : currentView === 'article-detail' ? (
          <SingleArticlePage
            articleId={selectedArticleKey}
            articles={articles}
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
            articles={articles}
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
            onOpenRfq={(kategori) => {
              setIsRfqModalOpen(true);
            }}
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
            onOpenRfq={(kategori) => {
              setIsRfqModalOpen(true);
            }}
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
            onOpenRfq={(kategori) => {
              setIsRfqModalOpen(true);
            }}
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
            onOpenRfq={(kategori) => {
              setIsRfqModalOpen(true);
            }}
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
              articles={articles}
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
          onOpenAdmin={() => {
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
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
    </div>
  );
};

export default App;
