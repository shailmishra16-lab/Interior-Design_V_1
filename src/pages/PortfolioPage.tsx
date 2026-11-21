import { useState } from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { siteConfig } from '../config/siteConfig';
import type { PortfolioProject } from '../types/studio';

interface PortfolioPageProps {
  onSelectProject: (project: PortfolioProject) => void;
}

const categories = [
  'All Projects',
  'Complete Home Interiors',
  'Living & Dining',
  'Modular Kitchen',
  'Bedroom & Wardrobe',
  'Custom Furniture',
] as const;

export function PortfolioPage({ onSelectProject }: PortfolioPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [selectedLocation, setSelectedLocation] = useState<string>('All NCR');

  const locations = ['All NCR', 'Noida Extension', 'Greater Noida', 'Greater Noida West', 'Noida Expressway', 'Delhi NCR'];

  const filtered = siteConfig.portfolio.filter((p) => {
    const catMatch = selectedCategory === 'All Projects' || p.category === selectedCategory;
    const locMatch = selectedLocation === 'All NCR' || p.location === selectedLocation;
    return catMatch && locMatch;
  });

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
          Project Portfolio · Sample Design Concepts
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#252824]">
          Sample Home &amp; Room Interior Concepts
        </h1>
        <p className="text-base leading-relaxed text-[#454843]">
          Browse our curated residential design concepts across Greater Noida, Noida Extension, and Delhi NCR. All items below are illustrative sample projects demonstrating material palettes and indicative budgets.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-4 border-y border-[#D8C8B4] py-6">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`border px-4 py-2 text-xs font-medium tracking-wide transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#626B55] bg-[#626B55] text-[#F8F5EF]'
                    : 'border-[#252824]/20 bg-transparent text-[#252824] hover:border-[#B69A68]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#757873]">
            Location:
          </span>
          {locations.map((loc) => {
            const active = selectedLocation === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`border px-3 py-1.5 text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#B69A68] bg-[#B69A68] text-[#F8F5EF]'
                    : 'border-[#252824]/15 text-[#454843] hover:border-[#252824]'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#D8C8B4] bg-[#FCF9F3] p-12 text-center space-y-4">
          <p className="font-serif text-2xl text-[#252824]">No sample projects match this filter combination.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All Projects');
              setSelectedLocation('All NCR');
            }}
            className="border border-[#252824] px-6 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#252824] hover:bg-[#252824] hover:text-[#F8F5EF] transition-colors cursor-pointer"
          >
            Reset Portfolio Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <article
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer border border-[#252824]/15 bg-[#FCF9F3] hover:border-[#B69A68] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-[#EBE8E2]">
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
                  <h2 className="font-serif text-2xl text-[#252824] group-hover:text-[#725B2F] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-xs text-[#454843]">
                    {project.society} · {project.areaSqFt}
                  </p>
                  <p className="pt-1 text-sm leading-relaxed text-[#454843]">{project.summary}</p>
                </div>
              </div>
              <div className="border-t border-[#D8C8B4]/70 px-6 py-4 flex items-center justify-between text-xs text-[#252824]">
                <span>Illustrative: {project.budgetBand}</span>
                <span className="uppercase tracking-[0.08em] text-[#725B2F] font-medium">
                  View Project Details
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
