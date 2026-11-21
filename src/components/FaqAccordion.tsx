import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(siteConfig.faqs[0]?.id || null);

  return (
    <div className="divide-y divide-[#D8C8B4] border-y border-[#D8C8B4]">
      {siteConfig.faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="py-5">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 text-left cursor-pointer group"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#725B2F]">
                  {faq.category}
                </p>
                <h4 className="mt-1 font-serif text-lg md:text-xl text-[#252824] group-hover:text-[#725B2F] transition-colors">
                  {faq.question}
                </h4>
              </div>
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-[#252824]/20 text-[#252824] group-hover:border-[#B69A68]">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen && (
              <p className="mt-3 pr-10 text-sm leading-relaxed text-[#454843]">
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
