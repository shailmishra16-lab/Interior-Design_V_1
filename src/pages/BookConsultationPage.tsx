import { SmartEnquiryForm } from '../components/SmartEnquiryForm';
import type { EnquiryPrefill, RoutePath } from '../types/studio';

interface BookConsultationPageProps {
  onNavigate: (path: RoutePath) => void;
  isDemoMode: boolean;
  prefill?: EnquiryPrefill;
}

export function BookConsultationPage({
  onNavigate,
  isDemoMode,
  prefill,
}: BookConsultationPageProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              Free Design Consultation
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#252824]">
              Request a Free Design Consultation
            </h1>
            <p className="text-sm leading-relaxed text-[#454843]">
              Share your property type, locality, interior requirements, and preferred date &amp; time request. Email is optional. Each saved submission receives a unique Reference Lead ID.
            </p>
          </div>

          <div className="border border-[#D8C8B4] bg-[#F6F3ED] p-6 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#626B55]">
              What Happens Next
            </p>
            <ol className="space-y-3 text-xs leading-relaxed text-[#454843]">
              <li>
                <strong className="text-[#252824]">1. Reference ID Issued:</strong> Receive your unique Lead ID upon storage confirmation.
              </li>
              <li>
                <strong className="text-[#252824]">2. Slot Confirmation Call:</strong> Preferred dates are treated as requests—our designer contacts you to confirm your appointment.
              </li>
              <li>
                <strong className="text-[#252824]">3. Budget &amp; Material Guidance:</strong> Discuss realistic room estimates and material options tailored to your home.
              </li>
            </ol>
          </div>

          <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 space-y-3">
            <p className="font-serif text-lg text-[#252824]">Only have a quick question?</p>
            <p className="text-xs text-[#454843]">
              Use our separate Ask a Question desk if you are not ready to request a full consultation yet.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/ask-question')}
              className="border border-[#252824] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
            >
              Ask a Question Instead
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <SmartEnquiryForm
            mode={isDemoMode ? 'demo' : 'live'}
            initialService={prefill?.service}
            initialBudget={prefill?.budget}
            initialPackageName={prefill?.packageName}
          />
        </div>
      </div>
    </div>
  );
}
