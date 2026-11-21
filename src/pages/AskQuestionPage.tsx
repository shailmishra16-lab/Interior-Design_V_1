import { AskQuestionForm } from '../components/AskQuestionForm';
import { FaqAccordion } from '../components/FaqAccordion';
import type { RoutePath } from '../types/studio';

interface AskQuestionPageProps {
  onNavigate: (path: RoutePath) => void;
  isDemoMode: boolean;
}

export function AskQuestionPage({ onNavigate, isDemoMode }: AskQuestionPageProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-14">
      <div className="max-w-3xl space-y-4 border-b border-[#D8C8B4] pb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
          Customer Query Management
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#252824]">
          Ask a Question
        </h1>
        <p className="text-base leading-relaxed text-[#454843]">
          Have a specific question about packages, modular kitchens, moisture-resistant materials, or remote coordination? Submit a dedicated query below and receive a tracked Query ID.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <AskQuestionForm mode={isDemoMode ? 'demo' : 'live'} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#D8C8B4] bg-[#F6F3ED] p-6 space-y-4">
            <p className="font-serif text-xl text-[#252824]">Ready to Discuss Your Home?</p>
            <p className="text-sm text-[#454843]">
              If you already know your property location and interior needs, submit a Free Design Consultation request with our team.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/book-consultation')}
              className="bg-[#252824] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
            >
              Free Design Consultation
            </button>
          </div>
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}
