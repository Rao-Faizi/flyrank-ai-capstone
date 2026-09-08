import React, { useState } from 'react';
import type { ScriptInput } from '../types/script';

interface ScriptFormProps {
  onSubmit: (input: ScriptInput) => void;
  isLoading: boolean;
}

/**
 * The main input form. Uses controlled inputs with HTML5 validation.
 * All labels are explicitly associated with inputs via `htmlFor` / `id` for accessibility.
 */
export const ScriptForm: React.FC<ScriptFormProps> = ({ onSubmit, isLoading }) => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [productBullets, setProductBullets] = useState('');
  const [yourName, setYourName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !industry.trim() || !productBullets.trim()) return;
    onSubmit({
      companyName: companyName.trim(),
      industry: industry.trim(),
      productBullets: productBullets.trim(),
      yourName: yourName.trim() || undefined,
    });
  };

  const isDisabled = isLoading || !companyName.trim() || !industry.trim() || !productBullets.trim();

  const inputClass = `
    w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-slate-100
    placeholder-slate-500 text-sm
    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
    transition-colors duration-150
  `;

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Sales script generator form">
      <div className="space-y-4">

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-slate-300 mb-1.5">
            Prospect Company Name <span aria-hidden="true" className="text-emerald-400">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="e.g. Acme Corp"
            className={inputClass}
            required
            aria-required="true"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-1.5">
            Industry / Vertical <span aria-hidden="true" className="text-emerald-400">*</span>
          </label>
          <input
            id="industry"
            type="text"
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="e.g. SaaS, Healthcare, FinTech"
            className={inputClass}
            required
            aria-required="true"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="productBullets" className="block text-sm font-medium text-slate-300 mb-1.5">
            Your Product's Key Value Points <span aria-hidden="true" className="text-emerald-400">*</span>
          </label>
          <textarea
            id="productBullets"
            value={productBullets}
            onChange={e => setProductBullets(e.target.value)}
            placeholder={"- Reduces onboarding time by 60%\n- Integrates with Salesforce\n- Used by 200+ enterprise teams"}
            className={`${inputClass} resize-none h-28`}
            required
            aria-required="true"
            maxLength={600}
          />
          <p className="mt-1 text-xs text-slate-500">{productBullets.length}/600 characters</p>
        </div>

        <div>
          <label htmlFor="yourName" className="block text-sm font-medium text-slate-300 mb-1.5">
            Your Name <span className="text-slate-500 font-normal">(optional)</span>
          </label>
          <input
            id="yourName"
            type="text"
            value={yourName}
            onChange={e => setYourName(e.target.value)}
            placeholder="e.g. Alex Jordan"
            className={inputClass}
            maxLength={80}
          />
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className="
            w-full rounded-lg px-6 py-3 font-semibold text-sm text-white
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            disabled:opacity-40 disabled:cursor-not-allowed
            focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
            transition-all duration-200 shadow-lg
          "
          aria-busy={isLoading}
        >
          {isLoading ? 'Generating Script…' : 'Generate Sales Script'}
        </button>
      </div>
    </form>
  );
};
