import { Check, MessageCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { EnquiryPrefill, RoutePath } from '../types/studio';

interface ServicesPageProps {
  onNavigate: (path: RoutePath, prefill?: EnquiryPrefill) => void;
  isDemoMode: boolean;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const hasWhatsApp = Boolean(siteConfig.business.whatsappNumber);

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-16">
      <div className="max-w-3xl space-y-4 border-b border-[#D8C8B4] pb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
          Our Services · Greater Noida &amp; Delhi NCR
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#252824]">
          Complete Home Interiors, Modular Kitchens &amp; Custom Furniture
        </h1>
        <p className="text-base leading-relaxed text-[#454843]">
          Choose end-to-end interiors for your entire home or start with a focused Modular Kitchen, Wardrobe, or Living Room upgrade. Clicking any service below preselects it in your consultation form.
        </p>
      </div>

      <div className="space-y-14">
        {siteConfig.services.map((service, index) => (
          <article
            key={service.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch border border-[#D8C8B4] bg-[#FCF9F3]"
          >
            <div className={`lg:col-span-6 min-h-[300px] bg-[#EBE8E2] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <ImageWithFallback
                src={service.image}
                alt={service.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>

            <div className={`lg:col-span-6 p-7 md:p-10 flex flex-col justify-between space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                  <span>{service.number}. {service.category}</span>
                  <span className="text-[#454843]">{service.estimatedDuration}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-[#252824]">{service.title}</h2>
                <p className="text-sm leading-relaxed text-[#454843]">{service.description}</p>

                <div className="border-t border-[#D8C8B4] pt-4 space-y-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
                    What Is Included
                  </p>
                  <ul className="space-y-2">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#252824]">
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-[#626B55]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[#D8C8B4] pt-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.1em] text-[#757873]">
                    Illustrative Range
                  </span>
                  <span className="font-serif text-lg text-[#252824]">{service.illustrativeStarting}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate('/book-consultation', { service: service.requirementKey })
                    }
                    className="bg-[#252824] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
                  >
                    Free Design Consultation
                  </button>
                  {hasWhatsApp && (
                    <a
                      href={buildWhatsAppUrl({ service: service.title })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-[#252824] px-4 py-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
