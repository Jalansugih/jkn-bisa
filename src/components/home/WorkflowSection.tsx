import React from 'react';
import { WORKFLOW_STEPS } from '../../data/mockData';
import { Search, Send, RefreshCw, FileText, CheckCircle, FilePlus } from 'lucide-react';

interface WorkflowSectionProps {
  onOpenRfqModal: () => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onOpenRfqModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return <Search className="w-3.5 h-3.5" />;
      case 'Send':
        return <Send className="w-3.5 h-3.5" />;
      case 'RefreshCw':
        return <RefreshCw className="w-3.5 h-3.5" />;
      case 'FileText':
        return <FileText className="w-3.5 h-3.5" />;
      case 'CheckCircle':
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return <CheckCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-200" id="cara-kerja">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-700 font-bold tracking-wider uppercase text-xs px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 inline-block mb-3 shadow-xs">
            Alur Kerja Praktis
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-slate-900 mb-4 leading-tight">
            Cara Kerja BinaUsaha
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Proses pemenuhan kebutuhan bisnis Anda berjalan transparan, efisien, dan terkawal dalam 5 langkah praktis.
          </p>
        </div>

        {/* 5 Step Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white rounded-2xl p-6 border border-slate-200 relative shadow-xs hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span
                  className="w-10 h-10 rounded-xl bg-blue-600 text-white font-heading font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-600/20 mb-4"
                >
                  {step.step}
                </span>
                <h3 className="font-heading font-bold text-base text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{step.desc}</p>
              </div>
              <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                <span>{step.badge}</span>
                {getIcon(step.icon)}
              </div>
            </div>
          ))}
        </div>

        {/* Cara Kerja Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            id="btn-workflow-register"
            onClick={onOpenRfqModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 inline-flex items-center gap-2 transition duration-300 cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            <span>Daftar Sekarang</span>
          </button>
        </div>
      </div>
    </section>
  );
};
