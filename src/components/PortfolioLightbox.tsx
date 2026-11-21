import { useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { buildWhatsAppUrl, siteConfig } from '../config/siteConfig';
import type { PortfolioProject } from '../types/studio';
import { ImageWithFallback } from './ImageWithFallback';

interface PortfolioLightboxProps {
  project: PortfolioProject | null;
  onClose: () => void;
  onBookSimilar: (project: PortfolioProject) => void;
}

export function PortfolioLightbox({
  project,
  onClose,
  onBookSimilar,
}: PortfolioLightboxProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const hasWhatsApp = Boolean(siteConfig.business.whatsappNumber);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101310]/80 backdrop-blur-sm p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-5xl max-h-[90vh] overflow-y-auto grid-cols-1 lg:grid-cols-12 border border-[#B69A68]/40 bg-[#F8F5EF]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-[#252824]/20 bg-[#F8F5EF] text-[#252824] hover:bg-[#252824] hover:text-[#F8F5EF] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="lg:col-span-7 bg-[#EBE8E2] min-h-[300px]">
          <ImageWithFallback
            src={project.image}
            alt={project.imageAlt}
            className="h-full w-full object-cover"
            eager
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              {project.category} · {project.projectTypeLabel}
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-[#252824]">{project.title}</h3>
            <p className="text-xs text-[#454843]">
              {project.society} · {project.location} · {project.areaSqFt}
            </p>
            <p className="text-sm leading-relaxed text-[#454843]">{project.summary}</p>

            <div className="border-t border-[#D8C8B4] pt-4 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
                Materials &amp; Finishes
              </p>
              <p className="text-sm text-[#252824]">{project.materials.join(' · ')}</p>
            </div>

            <div className="border-t border-[#D8C8B4] pt-4 space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
                Design Highlight · Illustrative Budget: {project.budgetBand}
              </p>
              <p className="text-sm text-[#252824]">{project.designHighlight}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => onBookSimilar(project)}
              className="w-full bg-[#252824] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
            >
              Book Consultation for Similar Space
            </button>
            {hasWhatsApp && (
              <a
                href={buildWhatsAppUrl({
                  service: `Project Inquiry: ${project.title}`,
                  budget: project.budgetBand,
                  location: project.location,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 border border-[#252824] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
