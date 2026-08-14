import React, { useState, useEffect } from 'react';
import { ExternalLink, Layers, Loader2, PackageCheck } from 'lucide-react';
import { getOrCreateQuotationData } from '../../utils/quoteGenerator';
import { FabricCard } from './FabricCard';
import { MtoSpecCard } from './MtoSpecCard';
import { PrimaryCtaBar } from './PrimaryCtaBar';
import { QuotationSkeleton } from './QuotationSkeleton';

/**
 * Dedicated Right Quotation Area Pane Component (Pane 3)
 * Displays vertically stacked Stock, NOOS, and MTO fabric categories with
 * 2-row grid truncation caps, dual "See all" CTAs, and an anchored Primary CTA bar.
 * Synchronized with the global loading state and dynamic phrase rotations.
 */
export function QuotationArea({
  activeQuoteId,
  authState,
  messages,
  isProcessing = false,
  isSessionLoading = false,
  currentLoadingPhrase = ''
}) {
  const [quoteData, setQuoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isNewChat = !messages || messages.length === 0;

  // Load quotation data whenever activeQuoteId, messages change or processing/loading ends
  useEffect(() => {
    let isMounted = true;

    if (isProcessing || isSessionLoading) {
      // Hide previous quote data while actively processing or loading session skeleton
      setQuoteData(null);
      setIsLoading(false);
      return;
    }

    if (isNewChat) {
      setQuoteData(null);
      setIsLoading(false);
      return;
    }

    // Immediately load the active quotation data synchronously upon timer resolution
    const data = getOrCreateQuotationData(activeQuoteId);
    if (isMounted) {
      setQuoteData(data);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [activeQuoteId, messages?.length, isNewChat, isProcessing, isSessionLoading]);

  const stockCards = quoteData?.stockCards || [];
  const noosCards = quoteData?.noosCards || [];
  const mtoQuotes = quoteData?.mtoQuotes || [];

  const handleHeaderSeeAll = (categoryName) => {
    const collectionSlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const targetUrl = `https://fabrito.com/collections/${collectionSlug}?quoteId=${activeQuoteId || 'active'}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const hasAnyMatches = stockCards.length > 0 || noosCards.length > 0 || mtoQuotes.length > 0;

  return (
    <section
      id="quotation-area-pane"
      data-quotation-pane="true"
      className="flex-[3] min-w-0 h-full bg-white flex flex-col justify-between overflow-hidden"
    >
      {/* Independently Scrollable Quotation Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 flex flex-col">
        {isProcessing || isSessionLoading ? (
          <QuotationSkeleton
            title={isSessionLoading ? 'Loading Quotation...' : 'Analyzing Specifications...'}
          />
        ) : isNewChat ? (
          <div className="relative flex-1 w-full min-h-[380px] flex flex-col justify-start select-none overflow-hidden rounded-xl">
            {/* Muted Low-Opacity Skeleton Grid */}
            <div className="w-full space-y-4 opacity-40 animate-pulse pointer-events-none p-1" aria-hidden="true">
              {/* Category 1: Stock/NOOS Skeleton Mock Cards */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-20 bg-neutral-200/60 rounded" />
                  <div className="h-3 w-5 bg-neutral-100/60 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={`empty-skel-stock-${n}`}
                      className="w-[180px] h-[260px] shrink-0 bg-neutral-100/50 border border-neutral-200/50 rounded-xl p-2.5 flex flex-col justify-between"
                    >
                      <div className="w-full h-28 rounded-lg bg-neutral-200/50" />
                      <div className="space-y-1.5 py-1">
                        <div className="h-2.5 w-3/4 bg-neutral-200/50 rounded" />
                        <div className="h-2 w-1/2 bg-neutral-200/40 rounded" />
                      </div>
                      <div className="pt-2 border-t border-neutral-200/40 flex justify-between items-center">
                        <div className="h-3 w-12 bg-neutral-200/50 rounded" />
                        <div className="h-2.5 w-8 bg-neutral-200/40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category 2: MTO Skeleton Mock Cards */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-16 bg-neutral-200/60 rounded" />
                  <div className="h-3 w-5 bg-neutral-100/60 rounded-full" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[1, 2].map((n) => (
                    <div
                      key={`empty-skel-mto-${n}`}
                      className="w-[300px] h-[130px] shrink-0 bg-neutral-100/50 border border-neutral-200/50 rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="h-2.5 w-1/3 bg-neutral-200/50 rounded" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-2 w-full bg-neutral-200/40 rounded" />
                          <div className="h-2 w-full bg-neutral-200/40 rounded" />
                        </div>
                      </div>
                      <div className="h-6 w-full bg-neutral-200/30 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sleek Center Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
              <div className="flex flex-col items-center gap-2.5 bg-white/90 backdrop-blur-xs px-5 py-4 rounded-2xl border border-neutral-200/80 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center border border-neutral-200/80">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Awaiting Specifications...
                </span>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 space-y-2 my-auto">
            <Loader2 className="w-5 h-5 animate-spin text-neutral-600" />
            <span className="text-xs font-medium text-neutral-500">
              Retrieving fabric matches...
            </span>
          </div>
        ) : !hasAnyMatches ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 my-auto">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-500 flex items-center justify-center mb-2 border border-neutral-200">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold text-neutral-800 mb-1">
              No Fabric Quotations Available
            </h4>
            <p className="text-[11px] text-neutral-500 max-w-[200px] leading-relaxed">
              No matching fabric options found for these filter specifications.
            </p>
          </div>
        ) : (
          <>
            {/* Category 1: Stock Fabrics */}
            {stockCards.length > 0 && (
              <section id="section-stock-fabrics" className="space-y-2">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-neutral-900 tracking-tight">
                      Stock Fabrics
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {stockCards.length}
                    </span>
                  </div>

                  {/* Header "See all" CTA (shown if truncated > 4) */}
                  {stockCards.length > 4 && (
                    <button
                      type="button"
                      id="btn-see-all-header-stock"
                      data-cta="true"
                      onClick={() => handleHeaderSeeAll('Stock Fabrics')}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-700 hover:text-neutral-900 hover:underline cursor-pointer"
                    >
                      <span>See all ({stockCards.length})</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {/* Compact Flex-Wrap Fixed-Width Layout */}
                <div className="flex flex-wrap gap-2.5">
                  {stockCards.slice(0, 4).map((card, index) => (
                    <FabricCard
                      key={card.id}
                      item={card}
                      isOverlay={stockCards.length > 4 && index === 3}
                      categoryName="Stock Fabrics"
                      totalCount={stockCards.length}
                      quoteId={activeQuoteId}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Category 2: NOOS (Never Out Of Stock) Fabrics */}
            {noosCards.length > 0 && (
              <section id="section-noos-fabrics" className="space-y-2">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-neutral-900 tracking-tight">
                      NOOS Fabrics
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {noosCards.length}
                    </span>
                  </div>

                  {/* Header "See all" CTA (shown if truncated > 4) */}
                  {noosCards.length > 4 && (
                    <button
                      type="button"
                      id="btn-see-all-header-noos"
                      data-cta="true"
                      onClick={() => handleHeaderSeeAll('NOOS Fabrics')}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-700 hover:text-neutral-900 hover:underline cursor-pointer"
                    >
                      <span>See all ({noosCards.length})</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                {/* Compact Flex-Wrap Fixed-Width Layout */}
                <div className="flex flex-wrap gap-2.5">
                  {noosCards.slice(0, 4).map((card, index) => (
                    <FabricCard
                      key={card.id}
                      item={card}
                      isOverlay={noosCards.length > 4 && index === 3}
                      categoryName="NOOS Fabrics"
                      totalCount={noosCards.length}
                      quoteId={activeQuoteId}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Category 3: MTO (Make To Order) Fabrics */}
            {mtoQuotes.length > 0 && (
              <section id="section-mto-fabrics" className="space-y-2">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-neutral-900 tracking-tight">
                      MTO Fabrics
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                      {mtoQuotes.length}
                    </span>
                  </div>
                </div>

                {/* Compact Flex-Wrap Fixed-Width Layout */}
                <div className="flex flex-wrap gap-2.5">
                  {mtoQuotes.map((quote, idx) => (
                    <MtoSpecCard key={quote.id} item={quote} index={idx} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Anchored Primary CTA Bar - Shown when quotation matches exist and not in processing */}
      {!isProcessing && !isNewChat && hasAnyMatches && (
        <PrimaryCtaBar authState={authState} activeQuoteId={activeQuoteId} />
      )}
    </section>
  );
}
