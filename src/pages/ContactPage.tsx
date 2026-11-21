import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { AskQuestionForm } from '../components/AskQuestionForm';
import { FaqAccordion } from '../components/FaqAccordion';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface ContactPageProps {
  onNavigate: (path: RoutePath) => void;
  isDemoMode: boolean;
}

export function ContactPage({ onNavigate, isDemoMode }: ContactPageProps) {
  const { hasVerifiedContact, phoneDisplay, phoneRaw, email, whatsappNumber } = siteConfig.business;

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-16">
      <div className="max-w-3xl space-y-4 border-b border-[#D8C8B4] pb-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
          Contact Us · {siteConfig.business.shortDescriptor}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#252824]">
          Connect With Our Interior Design Team
        </h1>
        <p className="text-base leading-relaxed text-[#454843]">
          Request a Free Design Consultation for your home or send a quick question to our team using the Customer Query Desk below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-7 space-y-6">
            <div className="flex items-start gap-3.5">
              <MapPin className="h-5 w-5 mt-0.5 shrink-0 text-[#725B2F]" />
              <div className="space-y-1 text-sm text-[#454843]">
                <p className="font-serif text-lg text-[#252824]">Service Region &amp; Appointments</p>
                <p>{siteConfig.business.serviceRegionNote}</p>
                <p className="pt-2 text-xs text-[#626B55]">{siteConfig.business.appointmentHours}</p>
              </div>
            </div>

            <div className="border-t border-[#D8C8B4] pt-5 flex items-start gap-3.5">
              <Phone className="h-5 w-5 mt-0.5 shrink-0 text-[#725B2F]" />
              <div className="text-sm">
                <p className="font-serif text-lg text-[#252824]">Telephone</p>
                {hasVerifiedContact && phoneDisplay ? (
                  <a
                    href={`tel:${phoneRaw}`}
                    className="text-[#454843] hover:text-[#252824] tabular-nums"
                  >
                    {phoneDisplay}
                  </a>
                ) : (
                  <p className="text-xs text-[#757873]">
                    Demonstration site — direct phone number is configured only when deployed for a live studio.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-[#D8C8B4] pt-5 flex items-start gap-3.5">
              <Mail className="h-5 w-5 mt-0.5 shrink-0 text-[#725B2F]" />
              <div className="text-sm">
                <p className="font-serif text-lg text-[#252824]">Studio Email</p>
                {hasVerifiedContact && email ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-[#454843] hover:text-[#252824]"
                  >
                    {email}
                  </a>
                ) : (
                  <p className="text-xs text-[#757873]">
                    Configure <code className="font-mono">VITE_STUDIO_EMAIL</code> and{' '}
                    <code className="font-mono">VITE_VERIFIED_CONTACT=&quot;true&quot;</code> to display a verified email.
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-[#D8C8B4] pt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/book-consultation')}
                className="bg-[#252824] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
              >
                Free Design Consultation
              </button>
              {whatsappNumber ? (
                <a
                  href={buildWhatsAppUrl({ service: 'Consultation & General Inquiry' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#252824] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Chat on WhatsApp
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 border border-[#D8C8B4] bg-[#F0EEE8] px-4 py-2.5 text-xs text-[#757873]">
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp link disabled until live number is configured
                </span>
              )}
            </div>
          </div>

          <div className="border border-[#D8C8B4] bg-[#F6F3ED] p-7 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              Service Regions
            </p>
            <ul className="space-y-2 text-sm text-[#454843]">
              {siteConfig.business.serviceAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Separate Ask a Question Form */}
        <div className="lg:col-span-7">
          <AskQuestionForm mode={isDemoMode ? 'demo' : 'live'} />
        </div>
      </div>

      <section className="border-t border-[#D8C8B4] pt-12 space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#252824]">Common Questions</h2>
        </div>
        <FaqAccordion />
      </section>
    </div>
  );
}
