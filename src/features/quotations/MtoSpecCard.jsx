import React from 'react';
import { Clock } from 'lucide-react';
import attributesData from '../../data/attributes.json';

/**
 * Ensures a valid fabric composition from attributes.json is always resolved
 */
function resolveComposition(item) {
  const comp = item?.specifications?.composition || item?.composition;
  if (comp && /\d%/.test(comp)) {
    return comp;
  }
  if (comp && Array.isArray(attributesData?.composition) && attributesData.composition.includes(comp)) {
    return comp;
  }

  const content = item?.specifications?.content || item?.content;
  if (content && Array.isArray(attributesData?.composition)) {
    const match = attributesData.composition.find((c) =>
      c.toLowerCase().includes(content.toLowerCase())
    );
    if (match) return match;
    return `100% ${content}`;
  }

  return attributesData?.composition?.[0] || '100% Cotton';
}

/**
 * Compact MTO (Make To Order) Fabric Quote Card with Inline Specs and Pill Layout.
 */
export function MtoSpecCard({ item, index }) {
  if (!item) return null;

  // Extract nested specifications object with fallback
  const specs = item.specifications || {};
  const composition = resolveComposition(item);
  const structure = specs.structure || item.structure;
  const gsm = specs.gsm || item.gsm;
  const rawPrice = specs.price || item.price;
  const price = typeof rawPrice === 'string'
    ? rawPrice.replace(/\$/g, '₹')
    : (typeof rawPrice === 'number' ? `₹${rawPrice}/${item.unit || 'm'}` : rawPrice);
  const greigeMoq = specs.greigeMoq || item.greigeMoq;
  const dyeingTechnique = specs.dyeingTechnique || item.dyeingTechnique;
  const dyeingMoq = specs.dyeingMoq || item.dyeingMoq;
  const printingTechnique = specs.printingTechnique || item.printingTechnique;
  const printingMoq = specs.printingMoq || item.printingMoq;
  const tat = specs.tat || item.tat;

  return (
    <div
      id={`mto-spec-card-${item.id || index}`}
      data-cta="true"
      className="w-[320px] max-w-full shrink-0 bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-xl p-3 shadow-2xs transition-all duration-200 space-y-2.5 flex flex-col justify-between"
    >
      <div className="space-y-2.5">
        {/* Header Row: Title on Left, Highlighted Unit Price on Right */}
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-neutral-900 tracking-tight truncate">
            {item.title}
          </h4>
          {price && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded shrink-0">
              {price}
            </span>
          )}
        </div>

        {/* Core Specs: Inline Pills (Composition, Structure, GSM) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {composition ? (
            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-medium border border-neutral-200/60">
              {composition}
            </span>
          ) : null}

          {structure ? (
            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-medium border border-neutral-200/60">
              {structure}
            </span>
          ) : null}

          {gsm ? (
            <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-medium border border-neutral-200/60">
              {gsm}
            </span>
          ) : null}
        </div>

        {/* Production & Minimums Block: Tightly grouped, slightly indented */}
        <div className="pl-2.5 border-l-2 border-neutral-200/90 space-y-1 text-[11px]">
          {greigeMoq && (
            <div className="flex items-center justify-between text-neutral-600">
              <span className="text-neutral-500">Greige Base MOQ</span>
              <span className="font-semibold text-neutral-800">{greigeMoq}</span>
            </div>
          )}

          {dyeingTechnique && (
            <div className="flex items-baseline justify-between text-neutral-600 gap-2">
              <span className="text-neutral-500 shrink-0">Dyeing</span>
              <span className="font-semibold text-neutral-800 text-right truncate">
                {dyeingTechnique}
                {dyeingMoq && dyeingMoq !== 'NA' ? (
                  <span className="font-normal text-neutral-500 ml-1">(MOQ: {dyeingMoq})</span>
                ) : null}
              </span>
            </div>
          )}

          {printingTechnique && (
            <div className="flex items-baseline justify-between text-neutral-600 gap-2">
              <span className="text-neutral-500 shrink-0">Printing</span>
              <span className="font-semibold text-neutral-800 text-right truncate">
                {printingTechnique}
                {printingMoq && printingMoq !== 'NA' ? (
                  <span className="font-normal text-neutral-500 ml-1">(MOQ: {printingMoq})</span>
                ) : null}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Turnaround Time with Clock Icon */}
      {tat && (
        <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 text-[10.5px] text-neutral-500">
          <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>
            Turnaround: <strong className="text-neutral-700 font-semibold">{tat}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
