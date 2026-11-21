import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface FloatingWhatsAppProps {
  currentRoute: RoutePath;
  isDemoMode: boolean;
}

export function FloatingWhatsApp({ currentRoute }: FloatingWhatsAppProps) {
  if (currentRoute === '/demo-studio' || !siteConfig.business.whatsappNumber) {
    // Only render active WhatsApp floating button when a WhatsApp number is configured
    return null;
  }

  const routeServiceMap: Partial<Record<RoutePath, string>> = {
    '/services': 'Complete Home Interiors & Modular Kitchen Services',
    '/portfolio': 'Project Similar to Portfolio Showcase',
    '/packages': 'Interior Design Packages & Illustrative Pricing',
    '/book-consultation': 'Free Design Consultation Follow-up',
  };

  const href = buildWhatsAppUrl({
    service: routeServiceMap[currentRoute] || 'Free Design Consultation',
  });

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 border border-[#252824] bg-[#252824] px-4 py-3 text-xs font-medium uppercase tracking-[0.08em] text-[#F8F5EF] transition-colors duration-200 hover:bg-[#626B55] hover:border-[#626B55] shadow-[0_16px_40px_-12px_rgba(37,40,36,0.18)]"
    >
      <MessageCircle className="h-4 w-4 text-[#B69A68]" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">Chat on WhatsApp</span>
    </a>
  );
}
