import React from 'react';
import { ExternalLink, Layers } from 'lucide-react';

/**
 * Visual Fabric Card component for Stock & NOOS quotation items.
 * Clean, elegant 200px x 300px card without nested boxes or redundant CTAs.
 * Supports a dark blurred overlay for the 4th card when category item count exceeds 4.
 */
export function FabricCard({ item, isOverlay, categoryName, totalCount, quoteId }) {
  if (!item) return null;

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (isOverlay) {
      const collectionSlug = (categoryName || '').toLowerCase().replace(/\s+/g, '-');
      const targetUrl = `https://fabrito.com/collections/${collectionSlug}?quoteId=${quoteId || 'active'}`;
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const targetUrl = `https://fabrito.com/fabrics/${item.sku.toLowerCase()}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id={`fabric-card-${item.id}`}
      data-cta="true"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
      className="w-[200px] h-[300px] shrink-0 group relative bg-white border border-neutral-200/80 hover:border-neutral-400 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Swatch Section (~140px high) */}
      <div
        className="relative h-[135px] w-full flex flex-col justify-between p-2.5 overflow-hidden"
        style={{ backgroundColor: item.fabricImage || '#3b82f6' }}
      >
        {/* Subtle Vignette & Texture Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 opacity-15 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between gap-1">
          <span
            id={`badge-type-${item.id}`}
            className={`px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-2xs ${
              item.type === 'Stock'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {item.type}
          </span>
          <span
            id={`badge-sku-${item.id}`}
            className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-neutral-900/70 text-neutral-200 border border-white/10 backdrop-blur-md"
          >
            {item.sku}
          </span>
        </div>

        {/* Bottom Swatch Color Label */}
        <div className="relative z-10 flex items-center justify-between text-white drop-shadow-xs">
          <span className="text-[11px] font-medium tracking-tight truncate">
            {item.color}
          </span>
          <ExternalLink className="w-3 h-3 text-white/80 group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0" />
        </div>
      </div>

      {/* Card Content (Clean & Flattened without nested boxes) */}
      <div className="p-3 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-1.5">
          {/* Fabric Title */}
          <h4
            id={`title-${item.id}`}
            className="text-xs font-bold text-neutral-900 tracking-tight line-clamp-1 group-hover:text-neutral-700 transition-colors"
          >
            {item.title}
          </h4>

          {/* Direct Specifications without field labels or nested boxes */}
          <div className="space-y-0.5 text-[11px] text-neutral-600">
            <p className="font-medium text-neutral-800 truncate">
              {item.structure}
            </p>
            <p className="text-neutral-500 text-[10.5px]">
              {item.gsm} gsm • {item.width}
            </p>
            <p className="text-neutral-500 text-[10.5px] truncate">
              {item.quantityFormatted} avail.
            </p>
          </div>
        </div>

        {/* Card Footer: Clean Price Display without extra buttons */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 tracking-tight">
            {typeof item.priceFormatted === 'string'
              ? item.priceFormatted.replace(/\$/g, '₹')
              : item.priceBase
              ? `₹${item.priceBase}/${item.unit || 'm'}`
              : item.priceFormatted}
          </span>
          <span className="text-[10px] font-medium text-neutral-400 group-hover:text-neutral-700 transition-colors">
            View details &rarr;
          </span>
        </div>
      </div>

      {/* 4th Card "See All" Overlay */}
      {isOverlay && (
        <div
          id={`fabric-card-overlay-${item.id}`}
          data-cta="true"
          role="button"
          tabIndex={0}
          className="absolute inset-0 z-20 bg-black/60 group-hover:bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center text-white space-y-3 transition-colors duration-200"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4 text-white" />
          </div>

          <span className="text-xs font-bold tracking-tight text-white">
            View all {totalCount}
          </span>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-neutral-900 text-[11px] font-bold shadow-md group-hover:bg-neutral-100 transition-colors">
            <span>Open Collection</span>
            <ExternalLink className="w-3 h-3 text-neutral-900" />
          </div>
        </div>
      )}
    </div>
  );
}

