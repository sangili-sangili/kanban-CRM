import React from 'react';
import { Lead } from '../types/crm';
import { PIPELINE_STAGES } from '../data/mockData';
import { useCRMStore } from '../store/useCRMStore';
import { formatCurrency, formatRelativeTime } from '../utils/cn';
import { 
  X, 
  Edit3, 
  Trash2, 
  Building2, 
  Mail, 
  User, 
  Calendar, 
  Tag, 
  ExternalLink 
} from 'lucide-react';

interface LeadDetailsModalProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
}) => {
  const theme = useCRMStore((s) => s.theme);
  const isDark = theme === 'dark';

  if (!lead) return null;

  const stageConfig = PIPELINE_STAGES.find((s) => s.id === lead.stage) || PIPELINE_STAGES[0];

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
      onDelete(lead.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(lead);
    onClose();
  };

  const initials = lead.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 transition-all border ${
          isDark
            ? 'bg-[#0F172A] border-white/10 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header bar with colored stage badge & close */}
        <div
          className={`flex items-start justify-between pb-4 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-3 min-w-0 pr-4">
            {lead.avatarUrl ? (
              <img
                src={lead.avatarUrl}
                alt={lead.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/30 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md flex-shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h2
                className={`text-lg font-bold truncate leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
                title={lead.name}
              >
                {lead.name}
              </h2>
              <p
                className={`text-xs truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
                title={lead.title || 'Sales Lead'}
              >
                {lead.title || 'Sales Lead'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stageConfig.pillBg}`}
            >
              {stageConfig.label}
            </span>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4">
          {/* Key Value Metrics Box */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDark
                ? 'bg-slate-900/60 border-white/5'
                : 'bg-slate-50 border-slate-200/80'
            }`}
          >
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Deal Value
              </span>
              <span className="text-2xl font-black text-emerald-500 tracking-tight flex items-center">
                {formatCurrency(lead.dealValue)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                Assigned Owner
              </span>
              <span
                className={`text-sm font-bold flex items-center justify-end space-x-1.5 ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lead.assignedOwner}</span>
              </span>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark
                  ? 'bg-slate-900/30 border-white/5'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400 font-medium">Company:</span>
                <span
                  className={`font-semibold truncate ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                  title={lead.company}
                >
                  {lead.company}
                </span>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark
                  ? 'bg-slate-900/30 border-white/5'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400 font-medium">Email:</span>
                <a
                  href={`mailto:${lead.email}`}
                  className="font-semibold text-indigo-400 hover:underline truncate"
                  title={lead.email}
                >
                  {lead.email}
                </a>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            </div>

            <div
              className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark
                  ? 'bg-slate-900/30 border-white/5'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 font-medium">Last Activity:</span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  {formatRelativeTime(lead.updatedAt)} ({new Date(lead.updatedAt).toLocaleDateString()})
                </span>
              </div>
            </div>
          </div>

          {/* Tags / Badges */}
          {lead.tags && lead.tags.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Tags & Classifications</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lead.tags.map((tag, idx) => (
                  <span
                    key={`${lead.id}-detail-tag-${idx}`}
                    className={`text-xs px-2.5 py-0.5 rounded-lg border font-medium ${
                      isDark
                        ? 'bg-slate-800 text-slate-200 border-white/10'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          className={`pt-4 border-t flex items-center justify-between ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center space-x-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-500/10"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Lead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
