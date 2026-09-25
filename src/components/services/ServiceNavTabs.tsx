import React from 'react';
import { Laptop, Shield, Wrench, TreePine, ArrowLeft, ArrowRight } from 'lucide-react';

export type ServicePageKey = 'digital' | 'legalitas' | 'konstruksi' | 'agro';

interface ServiceNavTabsProps {
  activeService: ServicePageKey;
  onSelectService: (service: ServicePageKey) => void;
  onBackToHome: () => void;
}

export const ServiceNavTabs: React.FC<ServiceNavTabsProps> = ({
  activeService,
  onSelectService,
  onBackToHome,
}) => {
  const services = [
    {
      id: 'digital' as ServicePageKey,
      name: 'Digital & Teknologi',
      subtitle: 'Website, POS Kasir, Apps & IT',
      icon: Laptop,
      color: 'blue',
      badge: 'Solusi Digital',
    },
    {
      id: 'legalitas' as ServicePageKey,
      name: 'Legalitas & Perizinan',
      subtitle: 'PT, CV, NIB, Halal & Merek',
      icon: Shield,
      color: 'emerald',
      badge: 'Resmi Kemenkumham',
    },
    {
      id: 'konstruksi' as ServicePageKey,
      name: 'Konstruksi & Material',
      subtitle: 'Renovasi, Interior & Sipil',
      icon: Wrench,
      color: 'amber',
      badge: 'Garansi Proyek',
    },
    {
      id: 'agro' as ServicePageKey,
      name: 'Agro & Green Industri',
      subtitle: 'Greenhouse, Hidroponik & Tani',
      icon: TreePine,
      color: 'green',
      badge: 'Pertanian Modern',
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1 hover:text-white font-medium transition cursor-pointer text-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </button>
            <span>/</span>
            <span className="text-slate-400 font-medium">Jasa & Solusi</span>
            <span>/</span>
            <span className="text-blue-400 font-bold capitalize">
              {services.find((s) => s.id === activeService)?.name}
            </span>
          </div>

          {/* Quick Info text */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Mitra Terverifikasi BinaUsaha • Garansi Resmi & Konsultasi Gratis</span>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800/80">
          {services.map((srv) => {
            const Icon = srv.icon;
            const isActive = activeService === srv.id;

            return (
              <button
                key={srv.id}
                onClick={() => onSelectService(srv.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate leading-tight">{srv.name}</p>
                  <p
                    className={`text-[10px] truncate leading-tight ${
                      isActive ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {srv.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
