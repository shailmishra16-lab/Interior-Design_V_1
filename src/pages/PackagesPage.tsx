import { Check, Info, MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { EnquiryPrefill, RoutePath } from '../types/studio';

interface PackagesPageProps {
  onNavigate: (path: RoutePath, prefill?: EnquiryPrefill) => void;
  isDemoMode: boolean;
}

export function PackagesPage({ onNavigate }: PackagesPageProps) {
  const hasWhatsApp = Boolean(siteConfig.business.whatsappNumber);

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-12">
      <div className="max-w-3xl space-y-4 border-b border-[#D8C8B4] pb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
          Configurable Interior Packages · Illustrative Budgets
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#252824]">
          Interior Packages &amp; Illustrative Pricing
        </h1>
        <p className="text-base leading-relaxed text-[#454843]">
          Explore five flexible tiers ranging from individual rooms to full custom homes. Select any package to prefill your consultation form.
        </p>
      </div>

      {/* Explicit Illustrative Price Disclaimer */}
      <div className="flex items-start gap-3 border border-[#B69A68] bg-[#FEF9EC] p-5 text-xs sm:text-sm text-[#58431A]">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-[#725B2F]" />
        <p>{siteConfig.packagesConfig.illustrativeDisclaimer}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {siteConfig.packages.map((pkg) => {
          const serviceDefault =
            pkg.id === 'individual-room' ? 'Modular Kitchen' : 'Complete Home Interiors';

          return (
            <article
              key={pkg.id}
              className={`flex flex-col justify-between border p-8 space-y-8 ${
                pkg.highlighted
                  ? 'border-[#252824] bg-[#FCF9F3]'
                  : 'border-[#D8C8B4] bg-[#F6F3ED]'
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                    {pkg.highlighted ? 'Popular Choice' : 'Illustrative Package'}
                  </span>
                </div>

                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#252824]">{pkg.name}</h2>
                  <p className="mt-1.5 text-sm text-[#454843]">{pkg.tagline}</p>
                </div>

                <div className="border-y border-[#D8C8B4] py-4">
                  <p className="font-serif text-2xl text-[#252824] tabular-nums">
                    {pkg.illustrativePrice}
                  </p>
                  <p className="mt-1 text-xs text-[#454843]">{pkg.idealFor}</p>
                </div>

                <ul className="space-y-3">
                  {pkg.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-sm text-[#252824]">
                      <Check className="h-4 w-4 mt-0.5 shrink-0 text-[#626B55]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#D8C8B4]">
                <p className="text-xs text-[#454843]">{pkg.estimatedTimelineNote}</p>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate('/book-consultation', {
                      service: serviceDefault,
                      budget: pkg.budgetBandValue,
                      packageName: pkg.name,
                    })
                  }
                  className={`w-full py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                    pkg.highlighted
                      ? 'bg-[#252824] text-[#F8F5EF] hover:bg-[#626B55]'
                      : 'border border-[#252824] text-[#252824] hover:bg-[#252824] hover:text-[#F8F5EF]'
                  }`}
                >
                  Select &amp; Book Consultation
                </button>
                {hasWhatsApp && (
                  <a
                    href={buildWhatsAppUrl({
                      packageName: pkg.name,
                      budget: pkg.illustrativePrice,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-[#454843] hover:text-[#252824]"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#626B55]" />
                    Chat on WhatsApp
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
