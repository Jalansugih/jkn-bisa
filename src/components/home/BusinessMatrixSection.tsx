import React from 'react';
import { BUSINESS_MATRIX } from '../../data/mockData';
import { Rocket, Cpu, Building, ShieldCheck, Leaf, Layers, ArrowRight } from 'lucide-react';

interface BusinessMatrixSectionProps {
  onSelectMatrixItem?: (catKey: string) => void;
  onSelectProduct?: (prodKey: string) => void;
}

export const BusinessMatrixSection: React.FC<BusinessMatrixSectionProps> = ({ onSelectMatrixItem, onSelectProduct }) => {
  const handleSelect = (categoryKey: string) => {
    if (onSelectMatrixItem) {
      onSelectMatrixItem(categoryKey);
    } else if (onSelectProduct) {
      onSelectProduct(categoryKey);
    }
  };
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Building':
        return <Building className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5" />;
      case 'Layers':
        return <Layers className="w-5 h-5" />;
      default:
        return <Rocket className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-200" id="matrix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Panduan Sesuai Fase Bisnis
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">
            Apa yang Sedang Anda Bangun / Butuhkan?
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Pilih tujuan bisnis Anda di bawah ini untuk melihat kombinasi produk dan solusi terbaik yang dapat disediakan.
          </p>
        </div>

        {/* Need Solution Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUSINESS_MATRIX.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:bg-blue-50/20 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 bg-blue-100 border border-blue-200 text-blue-700 rounded-xl flex items-center justify-center mb-4 font-bold group-hover:border-blue-300 shadow-xs">
                  {getIcon(item.icon)}
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
              </div>
              <a
                href="#kebutuhan"
                onClick={() => handleSelect(item.categoryKey)}
                className="text-xs font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                {item.linkText} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
