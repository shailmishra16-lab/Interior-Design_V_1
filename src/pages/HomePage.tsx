import { ArrowRight, MessageCircle } from 'lucide-react';
import { FaqAccordion } from '../components/FaqAccordion';
import { FloorPlanHotspotViewer } from '../components/FloorPlanHotspotViewer';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MaterialMoodboardMatrix } from '../components/MaterialMoodboardMatrix';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { EnquiryPrefill, PortfolioProject, RoutePath } from '../types/studio';

interface HomePageProps {
  onNavigate: (path: RoutePath, prefill?: EnquiryPrefill) => void;
  onSelectProject: (project: PortfolioProject) => void;
  isDemoMode: boolean;
}

export function HomePage({ onNavigate, onSelectProject }: HomePageProps) {
  const featuredProjects = siteConfig.portfolio.slice(0, 3);
  const hasWhatsApp = Boolean(siteConfig.business.whatsappNumber);

  return (
    <div>
      {/* 1. Hero Split */}
      <section className="mx-auto max-w-[1440px] px-6 pt-10 pb-14 md:px-10 md:pt-14 lg:px-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div className="space-y-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                {siteConfig.business.shortDescriptor}
              </p>
              <h1 className="font-serif text-[36px] leading-[44px] sm:text-[46px] sm:leading-[56px] lg:text-[56px] lg:leading-[68px] font-normal tracking-[-0.02em] text-[#252824]">
                Thoughtful Home Interiors Crafted in Stone, Wood &amp; Light.
              </h1>
              <p className="text-base sm:text-lg font-light leading-relaxed text-[#454843] max-w-xl">
                Aaranya Interiors designs Complete Home Interiors, Modular Kitchens, and Custom Furniture across Greater Noida, Noida Extension, and Delhi NCR—combining warm minimalism with practical everyday storage.
              </p>
            </div>

            <div className="mt-10 space-y-5">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('/book-consultation')}
                  className="bg-[#252824] px-8 py-4 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
                >
                  Free Design Consultation
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('/portfolio')}
                  className="border border-[#252824] px-7 py-4 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
                >
                  Project Portfolio
                </button>
              </div>
              <p className="text-xs text-[#454843]">
                {siteConfig.business.isDemonstrationSite
                  ? 'Demonstration Website · Showing sample residential concepts and illustrative packages.'
                  : siteConfig.business.serviceRegionNote}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 min-h-[340px] lg:min-h-[560px] border border-[#252824]/10 bg-[#EBE8E2]">
            <ImageWithFallback
              src={siteConfig.images.heroLiving}
              alt="Sample Complete Home Interiors living room with warm walnut paneling and natural stone coffee table"
              className="h-full w-full object-cover"
              eager
              caption="Aaranya Interiors — Complete Home Interiors"
            />
          </div>
        </div>

        {/* 4-Column Studio Highlights Strip (No unverified vanity counts or guaranteed timelines) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#D8C8B4] bg-[#FCF9F3] divide-y sm:divide-y-0 sm:divide-x divide-[#D8C8B4]">
          {siteConfig.studioHighlights.map((item) => (
            <div key={item.title} className="p-6 md:p-7">
              <p className="font-serif text-xl text-[#252824]">{item.title}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#725B2F]">
                {item.label}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[#454843]">{item.context}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Interior Services */}
      <section className="border-t border-[#D8C8B4] bg-[#F6F3ED] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D8C8B4]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                Interior Design Services
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-[40px] md:leading-[50px] font-normal text-[#252824]">
                Complete Home Interiors, Kitchens &amp; Custom Furniture
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/services')}
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-[#252824] border-b border-[#252824]/40 pb-1 hover:border-[#B69A68] hover:text-[#725B2F] transition-colors cursor-pointer self-start md:self-auto"
            >
              View All Services
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteConfig.services.map((service) => (
              <article
                key={service.id}
                className="flex flex-col justify-between border border-[#D8C8B4] bg-[#FCF9F3]"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-[#EBE8E2] border-b border-[#D8C8B4]">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </div>
                  <div className="p-6 md:p-8 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                      <span>{service.number}. {service.category}</span>
                      <span className="text-[#454843]">{service.estimatedDuration}</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#252824]">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-[#454843]">{service.description}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 md:px-8 md:pb-8 pt-4 border-t border-[#D8C8B4]/60 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#252824]">
                    <strong className="font-medium">{service.illustrativeStarting}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate('/book-consultation', { service: service.requirementKey })
                    }
                    className="border border-[#252824] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#252824] hover:text-[#F8F5EF] transition-colors cursor-pointer"
                  >
                    Free Design Consultation
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sample Project Portfolio */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D8C8B4]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              Project Portfolio · Sample Concepts
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-[40px] md:leading-[50px] font-normal text-[#252824]">
              Explore Room &amp; Home Design Concepts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/portfolio')}
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] text-[#252824] border-b border-[#252824]/40 pb-1 hover:border-[#B69A68] hover:text-[#725B2F] transition-colors cursor-pointer self-start md:self-auto"
          >
            View Full Portfolio ({siteConfig.portfolio.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {featuredProjects.map((project, index) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className={`group cursor-pointer border border-[#252824]/10 bg-[#FCF9F3] transition-colors hover:border-[#B69A68] ${
                index === 0 ? 'lg:col-span-6' : 'lg:col-span-3'
              }`}
            >
              <div className={`${index === 0 ? 'aspect-[16/11]' : 'aspect-[4/3]'} overflow-hidden bg-[#EBE8E2]`}>
                <ImageWithFallback
                  src={project.image}
                  alt={project.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-6 space-y-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                  {project.category} · {project.projectTypeLabel}
                </p>
                <h3 className="font-serif text-xl md:text-2xl text-[#252824] group-hover:text-[#725B2F] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-[#454843]">
                  {project.society} · {project.areaSqFt}
                </p>
                <p className="pt-1 text-sm text-[#454843] line-clamp-2">{project.summary}</p>
                <p className="pt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#725B2F]">
                  View Project Details →
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Material Palette & Interactive Home Layout */}
      <section className="border-t border-[#D8C8B4] bg-[#F0EEE8] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 space-y-12">
          <MaterialMoodboardMatrix />
          <FloorPlanHotspotViewer onNavigate={(p) => onNavigate(p)} />
        </div>
      </section>

      {/* 5. Sample Client Stories */}
      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="pb-10 border-b border-[#D8C8B4]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            Client Stories · Illustrative Case Studies
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-[40px] md:leading-[50px] font-normal text-[#252824]">
            How We Approach Real Home Challenges
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.testimonials.map((item) => (
            <div key={item.id} className="flex flex-col justify-between border border-[#D8C8B4] bg-[#FCF9F3] p-7 space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#626B55]">
                  {item.projectType}
                </p>
                <p className="font-serif text-lg leading-relaxed text-[#252824]">
                  “{item.quote}”
                </p>
                <div className="border-t border-[#D8C8B4] pt-4 text-xs leading-relaxed text-[#454843] space-y-1.5">
                  <p><strong className="text-[#252824]">Challenge:</strong> {item.challenge}</p>
                  <p><strong className="text-[#252824]">Solution:</strong> {item.approach}</p>
                </div>
              </div>
              <div className="border-t border-[#D8C8B4]/60 pt-4">
                <p className="font-serif text-base text-[#252824]">{item.clientName}</p>
                <p className="text-xs text-[#454843]">{item.residence}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ + Consultation Invitation */}
      <section className="border-t border-[#D8C8B4] bg-[#F6F3ED] py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              Plan Your Space
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#252824]">
              Questions Before Requesting a Consultation?
            </h2>
            <p className="text-sm leading-relaxed text-[#454843]">
              Whether you have just received keys to an apartment in Noida Extension or want to redesign your kitchen or bedrooms in Greater Noida or Delhi NCR, share your floor plan and budget range to get started.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('/book-consultation')}
                className="bg-[#252824] px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
              >
                Free Design Consultation
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/ask-question')}
                className="border border-[#252824] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
              >
                Ask a Question
              </button>
              {hasWhatsApp && (
                <a
                  href={buildWhatsAppUrl({ service: 'Complete Home Interiors Consultation' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#252824]/30 px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:border-[#252824] transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-[#626B55]" />
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <FaqAccordion />
          </div>
        </div>
      </section>
    </div>
  );
}
