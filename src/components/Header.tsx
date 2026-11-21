import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface HeaderProps {
  currentRoute: RoutePath;
  onNavigate: (path: RoutePath) => void;
}

const navItems: { label: string; path: RoutePath }[] = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Packages', path: '/packages' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Header({ currentRoute, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (path: RoutePath) => {
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#252824]/10 bg-[#F8F5EF]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-16">
        {/* Zone 1: Single-line Wordmark linking to Homepage */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[#252824] whitespace-nowrap shrink-0 hover:text-[#725B2F] transition-colors"
        >
          {siteConfig.business.logoText}
        </a>

        {/* Zone 2: Concise single-line navigation links including explicit Home */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active = currentRoute === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.path);
                }}
                className={`relative py-1 text-[13px] font-medium tracking-[0.05em] whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'text-[#252824]' : 'text-[#454843] hover:text-[#252824]'
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-[#B69A68] transition-all duration-200 ${
                    active ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('/book-consultation')}
            className="hidden sm:inline-flex items-center justify-center bg-[#252824] px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] transition-colors duration-200 hover:bg-[#626B55] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Free Design Consultation
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex lg:hidden h-11 w-11 items-center justify-center border border-[#252824]/20 text-[#252824] hover:border-[#B69A68] transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#D8C8B4] bg-[#F8F5EF] px-6 py-6">
          <nav className="flex flex-col divide-y divide-[#D8C8B4]/60" aria-label="Mobile Navigation">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.path);
                }}
                className={`py-3.5 text-sm font-medium tracking-wide transition-colors ${
                  currentRoute === item.path ? 'text-[#725B2F]' : 'text-[#252824]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/ask-question"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/ask-question');
              }}
              className="py-3.5 text-sm font-medium tracking-wide text-[#454843]"
            >
              Ask a Question
            </a>
            <a
              href="/demo-studio"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('/demo-studio');
              }}
              className="py-3.5 text-sm font-medium tracking-wide text-[#454843]"
            >
              Demo &amp; Sheets Setup
            </a>
          </nav>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => handleLinkClick('/book-consultation')}
              className="w-full bg-[#252824] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
            >
              Free Design Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
