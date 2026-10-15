import React, { useState, useEffect } from 'react';
import { useCRMStore } from '../store/useCRMStore';
import { StageId } from '../types/crm';
import { PIPELINE_STAGES } from '../data/mockData';
import { X, Trash2, DollarSign, User, Building, Mail, Tag, AlertCircle } from 'lucide-react';

interface LeadModalProps {
  leadId: string | null;
  defaultStageId?: StageId;
  onClose: () => void;
}

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  dealValue?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

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
      setName('');
      setTitle('Face Badge');
      setCompany('');
      setEmail('');
      setTags(['New', 'Qualified']);
    }
    setErrors({});
  }, [existingLead, defaultStageId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Contact name is required';
    }

    if (!company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (dealValue === '' || isNaN(Number(dealValue)) || Number(dealValue) < 0) {
      newErrors.dealValue = 'Valid deal value is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const numericDealValue = typeof dealValue === 'number' ? dealValue : (Number(dealValue) || 0);

    if (existingLead) {
      updateLead(existingLead.id, {
        name: name.trim(),
        title: title.trim(),
        company: company.trim(),
        email: email.trim(),
        dealValue: numericDealValue,
        stage,
        assignedOwner,
        tags,
      });
    } else {
      addLead({
        name: name.trim(),
        title: title.trim(),
        company: company.trim(),
        email: email.trim(),
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

  const getInputClass = (hasError?: boolean) => {
    if (hasError) {
      return isDark
        ? 'bg-slate-900 border border-rose-500 text-white placeholder-slate-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-500/25'
        : 'bg-rose-50/30 border border-rose-500 text-slate-900 placeholder-slate-400 focus:border-rose-500 focus:bg-white focus:ring-1 focus:ring-rose-500/25';
    }
    return isDark
      ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:border-indigo-500'
      : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white';
  };

  const labelClass = `flex items-center text-xs font-semibold uppercase tracking-wider mb-1 ${
    isDark ? 'text-slate-300' : 'text-slate-600'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl transition-colors max-h-[92vh] overflow-y-auto ${
          isDark
            ? 'bg-[#0F172A] border border-white/10 text-slate-100'
            : 'bg-white border border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between pb-3 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <div>
            <h2
              className={`text-lg font-bold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {existingLead ? 'Edit Sales Lead' : 'Create New Lead'}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Fields marked with <span className="text-rose-500 font-bold">*</span> are mandatory
            </p>
          </div>
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
        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
          
          {/* 1. Lead / Contact Name (Mandatory *) */}
          <div>
            <label className={labelClass}>
              <span>Lead / Contact Name</span>
              <span className="text-rose-500 font-bold ml-1 text-sm leading-none" title="Required field">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="e.g. Sangili or Siela"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${getInputClass(!!errors.name)}`}
              />
            </div>
            {errors.name && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center space-x-1 font-medium">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* 2. Badge & Deal Value Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <span>Badge / Subtitle</span>
                <span className="text-[10px] lowercase font-normal tracking-normal opacity-60 ml-1.5">(optional)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Face Badge"
                className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${getInputClass()}`}
              />
            </div>

            <div>
              <label className={labelClass}>
                <span>Deal Value ($)</span>
                <span className="text-rose-500 font-bold ml-1 text-sm leading-none" title="Required field">*</span>
              </label>
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
                    if (errors.dealValue) setErrors((prev) => ({ ...prev, dealValue: undefined }));
                    if (val === '') {
                      setDealValue('');
                    } else {
                      // Strip leading zeros if followed by numbers (e.g. 0222 -> 222)
                      const cleanVal = val.replace(/^0+(?=\d)/, '');
                      setDealValue(cleanVal === '' ? '' : Number(cleanVal));
                    }
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none font-semibold text-emerald-500 ${getInputClass(!!errors.dealValue)}`}
                />
              </div>
              {errors.dealValue && (
                <p className="text-rose-500 text-[11px] mt-1 flex items-center space-x-1 font-medium">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.dealValue}</span>
                </p>
              )}
            </div>
          </div>

          {/* 3. Pipeline Stage & Assigned Owner (Both Mandatory *) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>
                <span>Pipeline Stage</span>
                <span className="text-rose-500 font-bold ml-1 text-sm leading-none" title="Required field">*</span>
              </label>
              <select
                value={stage}
                required
                onChange={(e) => setStage(e.target.value as StageId)}
                className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${getInputClass()}`}
              >
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                <span>Assigned Owner</span>
                <span className="text-rose-500 font-bold ml-1 text-sm leading-none" title="Required field">*</span>
              </label>
              <select
                value={assignedOwner}
                required
                onChange={(e) => setAssignedOwner(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none transition-all cursor-pointer ${getInputClass()}`}
              >
                <option value="Sangili">Sangili</option>
                <option value="Matina">Matina</option>
                <option value="Siela">Siela</option>
                <option value="Alex">Alex</option>
              </select>
            </div>
          </div>

          {/* 4. Company (Mandatory *) */}
          <div>
            <label className={labelClass}>
              <span>Company</span>
              <span className="text-rose-500 font-bold ml-1 text-sm leading-none" title="Required field">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
                }}
                placeholder="e.g. Acme Corp or Stripe"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${getInputClass(!!errors.company)}`}
              />
            </div>
            {errors.company && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center space-x-1 font-medium">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.company}</span>
              </p>
            )}
          </div>

          {/* 5. Email (Mandatory *) */}
          <div>
            <label className={labelClass}>
              <span>Email</span>
              <span className="text-rose-500 font-bold ml-1 text-sm leading-none" title="Required field">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="client@company.com"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${getInputClass(!!errors.email)}`}
              />
            </div>
            {errors.email && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center space-x-1 font-medium">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* 6. Tags / Badges (Optional) */}
          <div>
            <label className={labelClass}>
              <span>Tags / Badges</span>
              <span className="text-[10px] lowercase font-normal tracking-normal opacity-60 ml-1.5">(optional)</span>
            </label>
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
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm focus:outline-none transition-all ${getInputClass()}`}
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
