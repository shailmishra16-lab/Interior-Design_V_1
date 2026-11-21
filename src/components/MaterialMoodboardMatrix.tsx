import { useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import { ImageWithFallback } from './ImageWithFallback';

export function MaterialMoodboardMatrix() {
  const swatches = siteConfig.materialMoodboard;
  const [activeId, setActiveId] = useState(swatches[0].id);
  const active = swatches.find((s) => s.id === activeId) || swatches[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-[#D8C8B4] bg-[#FCF9F3] p-6 md:p-10">
      <div className="lg:col-span-6 flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            Design &amp; Finish Palette
          </p>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl font-normal text-[#252824]">
            Natural Stones, Wood Veneers &amp; Fabrics
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#454843]">
            Explore our signature material combinations—select any swatch below to see its finish and recommended use across your home.
          </p>
        </div>

        <div className="mt-8 divide-y divide-[#D8C8B4] border-y border-[#D8C8B4]">
          {swatches.map((swatch) => {
            const isSelected = swatch.id === active.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setActiveId(swatch.id)}
                className={`w-full flex items-center justify-between gap-4 py-3.5 px-3 text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-[#F0EEE8]' : 'hover:bg-[#F6F3ED]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="h-6 w-6 rounded-full border border-[#252824]/25 shrink-0"
                    style={{ backgroundColor: swatch.swatchHex }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-serif text-base text-[#252824]">{swatch.name}</p>
                    <p className="text-xs text-[#454843]">{swatch.origin} · {swatch.finish}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725B2F] shrink-0">
                  {isSelected ? 'Selected' : 'View'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-[#F0EEE8] border border-[#D8C8B4] p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="font-serif text-lg text-[#252824]">{active.name}</span>
            <span className="text-[11px] uppercase tracking-[0.1em] text-[#626B55] font-medium">
              {active.finish}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#454843]">{active.grainNote}</p>
          <p className="mt-2 text-xs text-[#252824]">
            <span className="font-medium">Best Suited For:</span> {active.application}
          </p>
        </div>
      </div>

      <div className="lg:col-span-6">
        <div className="relative h-full min-h-[340px] border border-[#252824]/10 overflow-hidden bg-[#EBE8E2]">
          <ImageWithFallback
            src={siteConfig.images.materialMoodboard}
            alt="Sample interior material palette with travertine stone, smoked walnut, brushed brass, linen, and olive paint"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            caption="Material & Finish Palette"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#101310]/85 via-[#101310]/45 to-transparent p-6 text-[#F8F5EF]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#E1C28D]">
              Material Sample · {active.origin}
            </p>
            <p className="mt-1 font-serif text-xl">{active.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
