import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface FooterProps {
  onNavigate: (path: RoutePath) => void;
  isDemoMode: boolean;
}

export function Footer({ onNavigate, isDemoMode }: FooterProps) {
  const linkAction = (path: RoutePath) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <footer className="border-t border-[#D8C8B4] bg-[#F0EEE8] text-[#252824]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Summary */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif text-2xl font-normal text-[#252824]">
              {siteConfig.business.name}
            </h2>
            <p className="text-sm leading-relaxed text-[#454843] max-w-sm">
              {siteConfig.business.tagline}. Thoughtfully designed homes across {siteConfig.business.shortDescriptor}.
            </p>
            {siteConfig.business.isDemonstrationSite && (
              <p className="text-xs leading-relaxed text-[#725B2F]">
                Demonstration Studio Profile — Sample projects and illustrative pricing shown for preview.
              </p>
            )}
          </div>

          {/* Website Navigation */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#454843]">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/" onClick={linkAction('/')} className="hover:text-[#725B2F] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/services" onClick={linkAction('/services')} className="hover:text-[#725B2F] transition-colors">
                  Interior Services
                </a>
              </li>
              <li>
                <a href="/portfolio" onClick={linkAction('/portfolio')} className="hover:text-[#725B2F] transition-colors">
                  Project Portfolio
                </a>
              </li>
              <li>
                <a href="/packages" onClick={linkAction('/packages')} className="hover:text-[#725B2F] transition-colors">
                  Packages &amp; Pricing
                </a>
              </li>
              <li>
                <a href="/about" onClick={linkAction('/about')} className="hover:text-[#725B2F] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/book-consultation" onClick={linkAction('/book-consultation')} className="hover:text-[#725B2F] transition-colors">
                  Free Design Consultation
                </a>
              </li>
              <li>
                <a href="/ask-question" onClick={linkAction('/ask-question')} className="hover:text-[#725B2F] transition-colors">
                  Ask a Question
                </a>
              </li>
            </ul>
          </div>

          {/* Service Corridors & Verified Contact Info */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#454843]">
              Service Regions &amp; Contact
            </h3>
            <div className="text-sm text-[#454843] space-y-1.5">
              <p className="text-[#252824] font-medium">{siteConfig.business.serviceRegionNote}</p>
              <p className="pt-1 text-xs text-[#454843]">{siteConfig.business.appointmentHours}</p>
            </div>

            {siteConfig.business.hasVerifiedContact ? (
              <div className="pt-2 space-y-1 text-sm">
                {siteConfig.business.phoneDisplay && (
                  <p>
                    <a href={`tel:${siteConfig.business.phoneRaw}`} className="text-[#252824] hover:text-[#725B2F] tabular-nums">
                      {siteConfig.business.phoneDisplay}
                    </a>
                  </p>
                )}
                {siteConfig.business.email && (
                  <p>
                    <a href={`mailto:${siteConfig.business.email}`} className="text-[#454843] hover:text-[#725B2F]">
                      {siteConfig.business.email}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-[#757873]">
                Direct studio phone and address are configured during live client onboarding in{' '}
                <code className="font-mono">siteConfig.ts</code>.
              </p>
            )}
          </div>

          {/* Automation & Demonstration Access */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#454843]">
              Automation &amp; Setup
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="/demo-studio"
                  onClick={linkAction('/demo-studio')}
                  className="inline-flex items-center gap-1 text-[#252824] font-medium hover:text-[#725B2F] transition-colors"
                >
                  {isDemoMode ? 'Demo & Sheets Dashboard' : 'Demo & Sheets Setup'}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.developer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#454843] hover:text-[#252824]"
                >
                  {siteConfig.developer.name} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Demo Attribution */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[#D8C8B4] pt-8 text-xs text-[#454843] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {siteConfig.business.name} · Greater Noida, Noida Extension &amp; Delhi NCR
          </p>
          <p>
            <a
              href={siteConfig.developer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#252824] underline decoration-[#B69A68] underline-offset-4"
            >
              {siteConfig.developer.demoBannerText}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
