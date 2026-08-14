import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * QuotationSkeleton Component
 * Renders a structured, non-intrusive pulsing skeleton layout for Stock, NOOS, and MTO cards
 * during the active simulated loading state.
 */
export function QuotationSkeleton({ title = 'Analyzing Specifications...' }) {
  return (
    <div className="flex-1 p-3 space-y-5 overflow-hidden animate-pulse select-none">
      {/* Top Status Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-600 shrink-0" />
          <span className="text-xs font-semibold text-neutral-800 tracking-tight">
            {title}
          </span>
        </div>
      </div>

      {/* Category 1: Stock Fabrics Skeleton */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-24 bg-neutral-200/80 rounded" />
            <div className="h-3.5 w-6 bg-neutral-100 rounded-full" />
          </div>
          <div className="h-3 w-16 bg-neutral-100 rounded" />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={`stock-skel-${n}`}
              className="w-[160px] bg-white rounded-lg border border-neutral-200/70 p-2 space-y-2 flex flex-col justify-between"
            >
              {/* Image thumbnail skeleton */}
              <div className="w-full h-24 rounded-md bg-neutral-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-neutral-200/50" />
              </div>

              {/* Title and tags skeleton */}
              <div className="space-y-1.5">
                <div className="h-3 w-3/4 bg-neutral-200/70 rounded" />
                <div className="flex items-center gap-1">
                  <div className="h-3 w-10 bg-neutral-100 rounded" />
                  <div className="h-3 w-12 bg-neutral-100 rounded" />
                </div>
              </div>

              {/* Footer price skeleton */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <div className="h-3.5 w-12 bg-neutral-200/80 rounded" />
                <div className="h-2.5 w-8 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category 2: NOOS Fabrics Skeleton */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-24 bg-neutral-200/80 rounded" />
            <div className="h-3.5 w-6 bg-neutral-100 rounded-full" />
          </div>
          <div className="h-3 w-16 bg-neutral-100 rounded" />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={`noos-skel-${n}`}
              className="w-[160px] bg-white rounded-lg border border-neutral-200/70 p-2 space-y-2 flex flex-col justify-between"
            >
              <div className="w-full h-24 rounded-md bg-neutral-100 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-neutral-200/50" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-3/4 bg-neutral-200/70 rounded" />
                <div className="flex items-center gap-1">
                  <div className="h-3 w-10 bg-neutral-100 rounded" />
                  <div className="h-3 w-12 bg-neutral-100 rounded" />
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                <div className="h-3.5 w-12 bg-neutral-200/80 rounded" />
                <div className="h-2.5 w-8 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category 3: MTO Fabrics Skeleton */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-24 bg-neutral-200/80 rounded" />
          <div className="h-3.5 w-6 bg-neutral-100 rounded-full" />
        </div>

        <div className="w-full max-w-2xl bg-white rounded-lg border border-neutral-200/70 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-40 bg-neutral-200/80 rounded" />
            <div className="h-4 w-16 bg-neutral-100 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={`mto-skel-cell-${i}`} className="space-y-1">
                <div className="h-2.5 w-12 bg-neutral-100 rounded" />
                <div className="h-3 w-20 bg-neutral-200/70 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
