import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import type { QuerySubmissionResponse } from '../types/studio';

interface AskQuestionFormProps {
  mode: 'live' | 'demo';
  onSuccessRecord?: (record: {
    queryId: string;
    customerName: string;
    contactDetails: string;
    queryCategory: string;
    question: string;
    persistedToGoogleSheets: boolean;
  }) => void;
}

export function AskQuestionForm({ mode, onSuccessRecord }: AskQuestionFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [queryCategory, setQueryCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [contactConsent, setContactConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [result, setResult] = useState<QuerySubmissionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);

    const errors: Record<string, string> = {};
    if (customerName.trim().length < 2) errors.customerName = 'Please enter your name.';
    if (contactDetails.trim().length < 6) {
      errors.contactDetails = 'Enter your 10-digit mobile number or email address.';
    }
    if (!queryCategory) errors.queryCategory = 'Select a query category.';
    if (question.trim().length < 10) {
      errors.question = 'Please enter your question (at least 10 characters).';
    }
    if (!contactConsent) errors.contactConsent = 'Please confirm contact consent.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          contactDetails,
          queryCategory,
          question,
          contactConsent,
          mode,
          honeypot,
        }),
      });
      const data = (await response.json()) as QuerySubmissionResponse;

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setServerError(data.error || 'Could not log your question.');
        return;
      }

      setResult(data);
      if (onSuccessRecord && data.queryId) {
        onSuccessRecord({
          queryId: data.queryId,
          customerName,
          contactDetails,
          queryCategory,
          question,
          persistedToGoogleSheets: data.persistedToGoogleSheets,
        });
      }
    } catch {
      setServerError('Network error while submitting your question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-8 space-y-5">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center border ${
              result.persistedToGoogleSheets
                ? 'border-[#626B55] bg-[#626B55] text-[#F8F5EF]'
                : 'border-[#B69A68] bg-[#F0EEE8] text-[#725B2F]'
            }`}
          >
            {result.persistedToGoogleSheets ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              {result.persistedToGoogleSheets ? 'Customer Query Logged' : 'Validated in Preview Mode'}
            </p>
            <h3 className="mt-1 font-serif text-2xl text-[#252824]">
              Query Reference: <span className="font-mono">{result.queryId}</span>
            </h3>
          </div>
        </div>
        <p className="text-sm text-[#454843] leading-relaxed">{result.message}</p>
        <button
          type="button"
          onClick={() => {
            setResult(null);
            setQuestion('');
            setCustomerName('');
            setContactDetails('');
            setQueryCategory('');
            setContactConsent(false);
          }}
          className="border border-[#252824] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.1em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
        >
          Ask Another Question
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 md:p-10 space-y-6">
      <div className="border-b border-[#D8C8B4] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
          {mode === 'demo' ? 'Demonstration Query Desk' : 'Direct Studio Query Desk'}
        </p>
        <h3 className="mt-1 font-serif text-2xl text-[#252824]">Ask Our Interior Architects</h3>
        <p className="mt-1.5 text-sm text-[#454843]">
          Questions are logged separately from full project consultations under a dedicated Query ID.
        </p>
      </div>

      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {serverError && (
        <div className="flex items-start gap-3 border border-[#ba1a1a] bg-[#ffdad6]/40 p-4 text-sm text-[#93000a]">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="qry-name" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
            Your Name *
          </label>
          <input
            id="qry-name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Full name"
            className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
          />
          {fieldErrors.customerName && <p className="mt-1 text-xs text-[#ba1a1a]">{fieldErrors.customerName}</p>}
        </div>

        <div>
          <label htmlFor="qry-contact" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
            Mobile Number or Email *
          </label>
          <input
            id="qry-contact"
            type="text"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
            placeholder="10-digit mobile or email"
            className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
          />
          {fieldErrors.contactDetails && <p className="mt-1 text-xs text-[#ba1a1a]">{fieldErrors.contactDetails}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="qry-cat" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
          Query Category *
        </label>
        <select
          id="qry-cat"
          value={queryCategory}
          onChange={(e) => setQueryCategory(e.target.value)}
          className="mt-2 w-full border border-[#252824]/25 bg-[#FCF9F3] px-4 py-3 text-sm text-[#252824] focus:border-[#B69A68] focus:outline-none"
        >
          <option value="">Select category</option>
          {siteConfig.enquiryOptions.queryCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {fieldErrors.queryCategory && <p className="mt-1 text-xs text-[#ba1a1a]">{fieldErrors.queryCategory}</p>}
      </div>

      <div>
        <label htmlFor="qry-text" className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#454843]">
          Your Question *
        </label>
        <textarea
          id="qry-text"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about pricing inclusions, BWR ply specifications, site visit availability, or NRI supervision..."
          className="mt-2 w-full border border-[#252824]/25 bg-transparent px-4 py-3 text-sm text-[#252824] placeholder:text-[#252824]/40 focus:border-[#B69A68] focus:outline-none"
        />
        {fieldErrors.question && <p className="mt-1 text-xs text-[#ba1a1a]">{fieldErrors.question}</p>}
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={contactConsent}
            onChange={(e) => setContactConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[#252824] rounded-none"
          />
          <span className="text-xs leading-relaxed text-[#454843]">
            I agree to receive a response from {siteConfig.business.name} regarding this question.
          </span>
        </label>
        {fieldErrors.contactConsent && <p className="mt-1 text-xs text-[#ba1a1a]">{fieldErrors.contactConsent}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#252824] px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#F8F5EF] hover:bg-[#626B55] disabled:opacity-60 transition-colors cursor-pointer"
      >
        {submitting ? 'Submitting Question...' : 'Submit Question'}
      </button>
    </form>
  );
}
