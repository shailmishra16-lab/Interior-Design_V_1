import { ImageWithFallback } from '../components/ImageWithFallback';
import { siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface AboutPageProps {
  onNavigate: (path: RoutePath) => void;
}

const studioStages = [
  {
    step: '01',
    title: 'Discovery & Space Planning',
    detail: 'Understanding your rooms, daily routines, Vastu preferences, storage needs, and budget comfort.',
  },
  {
    step: '02',
    title: '3D Design & Material Selection',
    detail: 'Photorealistic 3D views paired with stone, wood laminate/veneer, fabric, and hardware choices.',
  },
  {
    step: '03',
    title: 'Precision Carpentry & Site Work',
    detail: 'Moisture-resistant modular fabrication coordinated smoothly alongside false ceiling, lighting, and painting.',
  },
  {
    step: '04',
    title: 'Quality Check & Handover',
    detail: 'Room-by-room inspection, hardware alignment, lighting check, and move-in ready handover.',
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:px-16 space-y-20">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
              Our Design Philosophy · {siteConfig.business.shortDescriptor}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#252824]">
              Thoughtful, Calm Interiors for Modern Indian Homes
            </h1>
            <p className="text-base leading-relaxed text-[#454843]">
              {siteConfig.business.name} focuses on warm, timeless residential interiors—combining practical storage, natural light, and honest materials like stone, walnut wood tones, brushed brass, and breathable fabrics.
            </p>
            <p className="text-base leading-relaxed text-[#454843]">
              Whether you need Complete Home Interiors, a Modular Kitchen, or Custom Furniture &amp; Wardrobes across Greater Noida, Noida Extension, or Delhi NCR, every project begins with clear 2D/3D planning and an itemized Bill of Quantities (BOQ).
            </p>
          </div>

          <div className="border-t border-[#D8C8B4] pt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/book-consultation')}
              className="bg-[#252824] px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
            >
              Free Design Consultation
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/portfolio')}
              className="border border-[#252824] px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.1em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
            >
              View Project Portfolio
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 min-h-[380px] border border-[#252824]/10 bg-[#EBE8E2]">
          <ImageWithFallback
            src={siteConfig.images.atelierStudio}
            alt="Sample architectural studio workspace with natural stone and wood finish boards"
            className="h-full w-full object-cover"
            eager
          />
        </div>
      </section>

      {/* 4-Stage Execution Methodology */}
      <section className="border-t border-[#D8C8B4] pt-14 space-y-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            Step-by-Step Workflow
          </p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl font-normal text-[#252824]">
            From Floor Plan to Move-In Day
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studioStages.map((st) => (
            <div key={st.step} className="border border-[#D8C8B4] bg-[#FCF9F3] p-6 space-y-3">
              <span className="font-mono text-xs text-[#725B2F]">{st.step}</span>
              <h3 className="font-serif text-xl text-[#252824]">{st.title}</h3>
              <p className="text-sm leading-relaxed text-[#454843]">{st.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Corridors */}
      <section className="border border-[#D8C8B4] bg-[#F6F3ED] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            Service Areas
          </p>
          <h3 className="mt-2 font-serif text-2xl text-[#252824]">Areas We Serve</h3>
          <p className="mt-3 text-sm text-[#454843]">
            {siteConfig.business.serviceRegionNote}. Consultations and site visits are scheduled by prior request.
          </p>
        </div>
        <ul className="divide-y divide-[#D8C8B4] border-y border-[#D8C8B4]">
          {siteConfig.business.serviceAreas.map((area) => (
            <li key={area} className="py-3 text-sm text-[#252824]">
              {area}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
