import React from 'react';

/**
 * ChatSkeleton Component
 * Renders a structured, clean skeleton feed when loading a chat session from the sidebar history.
 */
export function ChatSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto w-full flex flex-col p-3 space-y-4 animate-pulse select-none">
      {/* Message Row 1: User prompt on right */}
      <div className="max-w-[80%] ml-auto p-3 bg-neutral-100/90 rounded-2xl rounded-tr-xs space-y-1.5 border border-neutral-200/50">
        <div className="h-3.5 w-52 bg-neutral-200/80 rounded" />
        <div className="h-3 w-36 bg-neutral-200/60 rounded" />
      </div>

      {/* Message Row 1: System reply on left */}
      <div className="w-full px-3 pt-2 pb-4 space-y-2 border-b border-neutral-100">
        <div className="h-3.5 w-full bg-neutral-100 rounded" />
        <div className="h-3.5 w-11/12 bg-neutral-100 rounded" />
        <div className="h-3.5 w-4/5 bg-neutral-100 rounded" />
        <div className="flex items-center gap-1.5 pt-1.5">
          <div className="h-5 w-16 bg-neutral-100/90 rounded-md" />
          <div className="h-5 w-20 bg-neutral-100/90 rounded-md" />
          <div className="h-5 w-14 bg-neutral-100/90 rounded-md" />
          <div className="h-5 w-24 bg-neutral-100/90 rounded-md" />
        </div>
      </div>

      {/* Message Row 2: Follow-up user prompt on right */}
      <div className="max-w-[70%] ml-auto p-3 bg-neutral-100/90 rounded-2xl rounded-tr-xs space-y-1.5 border border-neutral-200/50">
        <div className="h-3.5 w-44 bg-neutral-200/80 rounded" />
      </div>

      {/* Message Row 2: Follow-up system reply on left */}
      <div className="w-full px-3 pt-2 pb-4 space-y-2">
        <div className="h-3.5 w-5/6 bg-neutral-100 rounded" />
        <div className="h-3.5 w-2/3 bg-neutral-100 rounded" />
        <div className="flex items-center gap-1.5 pt-1">
          <div className="h-5 w-18 bg-neutral-100/90 rounded-md" />
          <div className="h-5 w-16 bg-neutral-100/90 rounded-md" />
        </div>
      </div>
    </div>
  );
}
