import { useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import type { RoutePath } from '../types/studio';

interface FloorPlanHotspotViewerProps {
  onNavigate: (path: RoutePath) => void;
}

export function FloorPlanHotspotViewer({ onNavigate }: FloorPlanHotspotViewerProps) {
  const hotspots = siteConfig.floorPlanHotspots;
  const [selectedId, setSelectedId] = useState(hotspots[0].id);
  const active = hotspots.find((h) => h.id === selectedId) || hotspots[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-[#D8C8B4] bg-[#F6F3ED] p-6 md:p-10">
      <div className="lg:col-span-7 relative min-h-[340px] md:min-h-[400px] border border-[#252824]/20 bg-[#FCF9F3] p-4 flex items-center justify-center">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full max-h-[380px]"
          role="img"
          aria-label="Sample 3 BHK and 4 BHK interactive home layout"
        >
          <rect x="30" y="30" width="540" height="340" fill="none" stroke="#252824" strokeWidth="2.5" />
          <line x1="250" y1="30" x2="250" y2="235" stroke="#252824" strokeWidth="1.5" />
          <line x1="395" y1="30" x2="395" y2="210" stroke="#252824" strokeWidth="1.5" />
          <line x1="30" y1="235" x2="395" y2="235" stroke="#252824" strokeWidth="1.5" />
          <line x1="395" y1="210" x2="570" y2="210" stroke="#252824" strokeWidth="1.5" />

          <rect x="65" y="105" width="120" height="40" fill="none" stroke="#B69A68" strokeWidth="1" />
          <rect x="90" y="160" width="70" height="38" fill="none" stroke="#626B55" strokeWidth="1" />
          <rect x="285" y="95" width="75" height="95" fill="none" stroke="#B69A68" strokeWidth="1" />
          <rect x="435" y="75" width="95" height="45" fill="none" stroke="#626B55" strokeWidth="1" />
          <rect x="425" y="36" width="135" height="22" fill="none" stroke="#252824" strokeWidth="0.8" />
          <rect x="425" y="255" width="105" height="90" fill="none" stroke="#B69A68" strokeWidth="1" />

          <text x="50" y="55" fill="#757873" fontSize="10" letterSpacing="1.5">LIVING ROOM</text>
          <text x="270" y="55" fill="#757873" fontSize="10" letterSpacing="1.5">DINING</text>
          <text x="415" y="55" fill="#757873" fontSize="10" letterSpacing="1.5">MODULAR KITCHEN</text>
          <text x="415" y="232" fill="#757873" fontSize="10" letterSpacing="1.5">MASTER BEDROOM</text>
          <text x="50" y="260" fill="#757873" fontSize="10" letterSpacing="1.5">FOYER &amp; STUDY AREA</text>

          <line x1="45" y1="350" x2="145" y2="350" stroke="#252824" strokeWidth="1" />
          <text x="45" y="344" fill="#454843" fontSize="9">SAMPLE HOME LAYOUT · ILLUSTRATIVE ZONING</text>
        </svg>

        {hotspots.map((spot, idx) => {
          const isActive = spot.id === active.id;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => setSelectedId(spot.id)}
              style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
              aria-label={`Inspect ${spot.zone}`}
              className={`absolute -translate-x-1/2 -translate-y-1/2 h-9 w-9 rounded-full border text-xs font-mono font-medium transition-transform duration-200 cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'bg-[#252824] text-[#F8F5EF] border-[#B69A68] scale-110'
                  : 'bg-[#F8F5EF] text-[#252824] border-[#252824] hover:bg-[#B69A68] hover:text-[#F8F5EF]'
              }`}
            >
              0{idx + 1}
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
            Interactive Home Layout
          </p>
          <h3 className="mt-2 font-serif text-2xl md:text-3xl font-normal text-[#252824]">
            Room-by-Room Space Planning
          </h3>
          <p className="mt-2 text-sm text-[#454843]">
            Click any numbered room marker on the sample floor plan to see how we plan furniture sizing, lighting, and finishes.
          </p>

          <div className="mt-6 border-t border-[#D8C8B4] pt-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#626B55]">
                {active.zone}
              </span>
              <span className="font-mono text-xs tabular-nums text-[#454843]">
                {active.dimensions}
              </span>
            </div>
            <h4 className="font-serif text-xl text-[#252824]">{active.title}</h4>
            <p className="text-sm leading-relaxed text-[#454843]">{active.specification}</p>
            <div className="border border-[#D8C8B4] bg-[#FCF9F3] px-4 py-3 text-xs text-[#252824]">
              <span className="font-semibold uppercase tracking-[0.08em] text-[#725B2F]">Suggested Finishes: </span>
              {active.materialNote}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('/book-consultation')}
            className="bg-[#252824] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#F8F5EF] hover:bg-[#626B55] transition-colors cursor-pointer"
          >
            Free Design Consultation
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/portfolio')}
            className="border border-[#252824] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#252824] hover:bg-[#B69A68] hover:border-[#B69A68] hover:text-[#F8F5EF] transition-colors cursor-pointer"
          >
            View Project Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
