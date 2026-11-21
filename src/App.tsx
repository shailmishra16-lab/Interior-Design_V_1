import { useEffect, useState } from 'react';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PortfolioLightbox } from './components/PortfolioLightbox';
import { SeoHead } from './components/SeoHead';
import { siteConfig } from './config/siteConfig';
import { AboutPage } from './pages/AboutPage';
import { AskQuestionPage } from './pages/AskQuestionPage';
import { BookConsultationPage } from './pages/BookConsultationPage';
import { ContactPage } from './pages/ContactPage';
import { DemoStudioPage } from './pages/DemoStudioPage';
import { HomePage } from './pages/HomePage';
import { PackagesPage } from './pages/PackagesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import type { EnquiryPrefill, PortfolioProject, RoutePath } from './types/studio';

const validRoutes: RoutePath[] = [
  '/',
  '/services',
  '/portfolio',
  '/packages',
  '/about',
  '/contact',
  '/book-consultation',
  '/ask-question',
  '/demo-studio',
];

function parseRoute(pathname: string): RoutePath {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return (validRoutes.includes(normalized as RoutePath) ? normalized : '/') as RoutePath;
}

function mapCategoryToRequirement(category: PortfolioProject['category']): string {
  switch (category) {
    case 'Modular Kitchen':
      return 'Modular Kitchen';
    case 'Custom Furniture':
    case 'Bedroom & Wardrobe':
      return 'Custom Furniture & Wardrobes';
    case 'Living & Dining':
      return 'Living & Dining Design';
    case 'Complete Home Interiors':
    default:
      return 'Complete Home Interiors';
  }
}

function mapBudgetBandToOption(budgetBand: string): string | undefined {
  return siteConfig.enquiryOptions.budgetBands.find((band) => band.includes(budgetBand));
}

export default function App() {
  const [route, setRoute] = useState<RoutePath>(() =>
    typeof window !== 'undefined' ? parseRoute(window.location.pathname) : '/'
  );
  const [isDemoMode, setIsDemoMode] = useState<boolean>(siteConfig.seo.defaultDemoMode);
  const [prefill, setPrefill] = useState<EnquiryPrefill | undefined>(undefined);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: RoutePath, nextPrefill?: EnquiryPrefill) => {
    setPrefill(nextPrefill);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#252824]">
      <SeoHead route={route} isDemoMode={isDemoMode} />

      {siteConfig.business.isDemonstrationSite && (
        <div className="border-b border-[#B69A68] bg-[#FEF9EC] px-4 py-2 text-center text-xs text-[#58431A]">
          <a
            href={siteConfig.developer.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-medium"
          >
            {siteConfig.developer.demoBannerText}
          </a>
          {route !== '/demo-studio' && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => navigate('/demo-studio')}
                className="underline font-semibold cursor-pointer"
              >
                Open Demo &amp; Google Sheets Setup
              </button>
            </>
          )}
        </div>
      )}

      <Header currentRoute={route} onNavigate={(p) => navigate(p)} />

      <main className="flex-1">
        {route === '/' && (
          <HomePage
            onNavigate={navigate}
            onSelectProject={setSelectedProject}
            isDemoMode={isDemoMode}
          />
        )}
        {route === '/services' && (
          <ServicesPage onNavigate={navigate} isDemoMode={isDemoMode} />
        )}
        {route === '/portfolio' && (
          <PortfolioPage onSelectProject={setSelectedProject} />
        )}
        {route === '/packages' && (
          <PackagesPage onNavigate={navigate} isDemoMode={isDemoMode} />
        )}
        {route === '/about' && <AboutPage onNavigate={(p) => navigate(p)} />}
        {route === '/contact' && (
          <ContactPage onNavigate={(p) => navigate(p)} isDemoMode={isDemoMode} />
        )}
        {route === '/book-consultation' && (
          <BookConsultationPage
            onNavigate={(p) => navigate(p)}
            isDemoMode={isDemoMode}
            prefill={prefill}
          />
        )}
        {route === '/ask-question' && (
          <AskQuestionPage onNavigate={(p) => navigate(p)} isDemoMode={isDemoMode} />
        )}
        {route === '/demo-studio' && (
          <DemoStudioPage isDemoMode={isDemoMode} onToggleDemoMode={setIsDemoMode} />
        )}
      </main>

      <Footer onNavigate={(p) => navigate(p)} isDemoMode={isDemoMode} />

      <FloatingWhatsApp currentRoute={route} isDemoMode={isDemoMode} />

      <PortfolioLightbox
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onBookSimilar={(proj) => {
          setSelectedProject(null);
          navigate('/book-consultation', {
            service: mapCategoryToRequirement(proj.category),
            budget: mapBudgetBandToOption(proj.budgetBand),
            packageName: proj.title,
          });
        }}
      />
    </div>
  );
}
