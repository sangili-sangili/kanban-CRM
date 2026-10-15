import React from 'react';
import { useCRMStore, selectMetrics } from '../store/useCRMStore';
import { formatCurrency } from '../utils/cn';
import { ArrowUpRight } from 'lucide-react';

export const MetricCards: React.FC = () => {
  const metrics = useCRMStore(selectMetrics);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Leads */}
      <div className="relative rounded-2xl p-5 border border-white/[0.08] bg-gradient-to-br from-blue-600/25 via-[#131E35] to-[#0D1527] shadow-xl overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Total Leads</span>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/25">
            <span>Trend</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {metrics.totalLeads}
          </span>
        </div>
      </div>

      {/* 2. Qualified Leads */}
      <div className="relative rounded-2xl p-5 border border-white/[0.08] bg-gradient-to-br from-rose-600/25 via-[#23172E] to-[#0D1527] shadow-xl overflow-hidden group hover:border-rose-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Qualified Leads</span>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/25">
            <span>Trend</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {metrics.qualifiedLeads}
          </span>
        </div>
      </div>

      {/* 3. Won Deals */}
      <div className="relative rounded-2xl p-5 border border-white/[0.08] bg-gradient-to-br from-emerald-600/25 via-[#132829] to-[#0D1527] shadow-xl overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Won Deals</span>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/25">
            <span>Trend</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {metrics.wonDeals}
          </span>
        </div>
      </div>

      {/* 4. Pipeline Value */}
      <div className="relative rounded-2xl p-5 border border-white/[0.08] bg-gradient-to-br from-purple-600/25 via-[#231B3D] to-[#0D1527] shadow-xl overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Pipeline Value</span>
          <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/25">
            <span>Trend</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {formatCurrency(metrics.totalPipelineValue)}
          </span>
        </div>
      </div>
    </div>
  );
};
