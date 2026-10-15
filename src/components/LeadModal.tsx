import React, { useState, useEffect } from 'react';
import { useCRMStore } from '../store/useCRMStore';
import { StageId } from '../types/crm';
import { PIPELINE_STAGES } from '../data/mockData';
import { X, Trash2, DollarSign, User, Building, Mail, Tag } from 'lucide-react';

interface LeadModalProps {
  leadId: string | null;
  defaultStageId?: StageId;
  onClose: () => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  leadId,
  defaultStageId = 'NEW',
  onClose,
}) => {
  const leads = useCRMStore((s) => s.leads);
  const addLead = useCRMStore((s) => s.addLead);
  const updateLead = useCRMStore((s) => s.updateLead);
  const deleteLead = useCRMStore((s) => s.deleteLead);
  const theme = useCRMStore((s) => s.theme);
  const isDark = theme === 'dark';

  const existingLead = leadId ? leads.find((l) => l.id === leadId) : null;

  const [name, setName] = useState('');
  const [title, setTitle] = useState('Face Badge');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [dealValue, setDealValue] = useState<number | ''>(50000);
  const [stage, setStage] = useState<StageId>(defaultStageId);
  const [assignedOwner, setAssignedOwner] = useState('Sangili');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['New', 'Qualified']);

  useEffect(() => {
    if (existingLead) {
      setName(existingLead.name);
      setTitle(existingLead.title || 'Face Badge');
      setCompany(existingLead.company);
      setEmail(existingLead.email);
      setDealValue(existingLead.dealValue);
      setStage(existingLead.stage);
      setAssignedOwner(existingLead.assignedOwner);
      setTags(existingLead.tags || []);
    } else {
      setStage(defaultStageId);
      setDealValue(50000);
    }
  }, [existingLead, defaultStageId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numericDealValue = typeof dealValue === 'number' ? dealValue : (Number(dealValue) || 0);

    if (existingLead) {
      updateLead(existingLead.id, {
        name,
        title,
        company,
        email,
        dealValue: numericDealValue,
        stage,
        assignedOwner,
        tags,
      });
    } else {
      addLead({
        name,
        title,
        company: company || 'Enterprise Client',
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        dealValue: numericDealValue,
        stage,
        assignedOwner,
        tags,
      });
    }
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDelete = () => {
    if (existingLead && window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(existingLead.id);
      onClose();
    }
  };

  const inputClass = isDark
    ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500'
    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white';

  const labelClass = `block text-xs font-semibold uppercase tracking-wider mb-1 ${
    isDark ? 'text-slate-300' : 'text-slate-600'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-colors ${
          isDark
            ? 'bg-[#0F172A] border border-white/10 text-slate-100'
            : 'bg-white border border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {existingLead ? 'Edit Sales Lead' : 'Create New Lead'}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-white/5'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className={labelClass}>Lead / Contact Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sangili or Siela"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Badge / Subtitle</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Face Badge"
                className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${inputClass}`}
              />
            </div>

            <div>
              <label className={labelClass}>Deal Value ($)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0"
                  required
                  value={dealValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setDealValue('');
                    } else {
                      // Strip leading zeros if followed by numbers (e.g. 0222 -> 222)
                      const cleanVal = val.replace(/^0+(?=\d)/, '');
                      setDealValue(cleanVal === '' ? '' : Number(cleanVal));
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none font-semibold text-emerald-500 ${inputClass}`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as StageId)}
                className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${inputClass}`}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Assigned Owner</label>
              <select
                value={assignedOwner}
                onChange={(e) => setAssignedOwner(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${inputClass}`}
              >
                <option value="Sangili">Sangili</option>
                <option value="Matina">Matina</option>
                <option value="Siela">Siela</option>
                <option value="Alex">Alex</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Company</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Enterprise Corp"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${inputClass}`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${inputClass}`}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags / Badges</label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. Qualified, Contacted, Won"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${inputClass}`}
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                  isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border-white/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-md border flex items-center space-x-1 ${
                    isDark
                      ? 'bg-slate-800 text-slate-200 border-white/10'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-rose-500 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className={`pt-4 border-t flex items-center justify-between ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}
          >
            {existingLead ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-1 text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Lead</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
              >
                {existingLead ? 'Save Changes' : 'Create Lead'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
