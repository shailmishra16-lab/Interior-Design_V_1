import { useEffect } from 'react';
import { siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface SeoHeadProps {
  route: RoutePath;
  isDemoMode: boolean;
}

const routeMeta: Record<RoutePath, { title: string; description: string }> = {
  '/': {
    title: 'Aaranya Interiors — Complete Home Interiors & Modular Kitchens in Greater Noida & Delhi NCR',
    description:
      'Demonstration interior design studio website showcasing Complete Home Interiors, Modular Kitchens, and Custom Furniture across Greater Noida, Noida Extension, and Delhi NCR.',
  },
  '/services': {
    title: 'Interior Design Services — Complete Home Interiors, Modular Kitchen & Custom Furniture',
    description:
      'Explore Complete Home Interiors, Modular Kitchens, Custom Furniture & Wardrobes, and Living Room Styling across Greater Noida and Delhi NCR.',
  },
  '/portfolio': {
    title: 'Project Portfolio (Sample Concepts) — Aaranya Interiors',
    description:
      'Browse illustrative residential interior concepts for Living & Dining, Modular Kitchens, Bedrooms, and Complete Home Interiors.',
  },
  '/packages': {
    title: 'Illustrative Interior Design Packages — Aaranya Interiors',
    description:
      'Compare illustrative interior package ranges from Individual Room Interiors to Luxury Custom Interiors for apartments and villas.',
  },
  '/about': {
    title: 'About Us & Design Process — Aaranya Interiors',
    description:
      'Learn about our warm minimalist design philosophy, space planning, transparent BOQ quotes, and step-by-step home interior workflow.',
  },
  '/contact': {
    title: 'Contact Us & Ask a Question — Aaranya Interiors',
    description:
      'Connect with our design desk serving Greater Noida, Noida Extension, and Delhi NCR or submit a direct customer question.',
  },
  '/book-consultation': {
    title: 'Free Design Consultation Request — Aaranya Interiors',
    description:
      'Share your property details, interior requirements, budget segment, and preferred consultation slot request.',
  },
  '/ask-question': {
    title: 'Ask a Question — Aaranya Interiors Customer Query Desk',
    description:
      'Have a question about packages, modular kitchens, design timelines, or site visits? Send a tracked query to our studio team.',
  },
  '/demo-studio': {
    title: 'Demo & Google Sheets Setup — Aaranya Interiors by AI Business Growth Lab',
    description:
      'Interactive demonstration of Google Sheets CRM automation, 25 synthetic leads, 10 customer queries, and email workflow setup.',
  },
};

export function SeoHead({ route, isDemoMode }: SeoHeadProps) {
  useEffect(() => {
    const meta = routeMeta[route] || routeMeta['/'];
    document.title = meta.title;

    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaTag('name', 'description', meta.description);
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:url', `${window.location.origin}${route}`);
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);

    // Enforce noindex on demonstration sites or /demo-studio route
    const shouldNoIndex = siteConfig.seo.noindex || isDemoMode || route === '/demo-studio';
    let robotsEl = document.querySelector('meta[name="robots"]');
    if (shouldNoIndex) {
      if (!robotsEl) {
        robotsEl = document.createElement('meta');
        robotsEl.setAttribute('name', 'robots');
        document.head.appendChild(robotsEl);
      }
      robotsEl.setAttribute('content', 'noindex, nofollow');
    } else if (robotsEl) {
      robotsEl.remove();
    }

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${route}`);

    // Structured Data (InteriorDesigner + FAQPage)
    const ldId = 'aaranya-structured-data';
    let scriptEl = document.getElementById(ldId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = ldId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const studioSchema: Record<string, unknown> = {
      '@type': 'InteriorDesigner',
      name: siteConfig.business.name,
      description: siteConfig.seo.defaultDescription,
      url: window.location.origin,
      areaServed: ['Greater Noida', 'Noida Extension', 'Noida', 'Delhi NCR'],
    };

    if (siteConfig.business.hasVerifiedContact) {
      if (siteConfig.business.phoneDisplay) {
        studioSchema.telephone = siteConfig.business.phoneDisplay;
      }
      if (siteConfig.business.email) {
        studioSchema.email = siteConfig.business.email;
      }
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        studioSchema,
        {
          '@type': 'FAQPage',
          mainEntity: siteConfig.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(structuredData);
  }, [route, isDemoMode]);

  return null;
}
