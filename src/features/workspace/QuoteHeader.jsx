import React, { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

/**
 * Header component spanning Chat Area and Quotations Area
 * Displays current Quote Title with more prominence and an icon CTA to edit it.
 */
export function QuoteHeader({ title, quoteId, onUpdateTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title || 'New Sourcing Query');

  // Sync edit value when title or quoteId prop changes
  useEffect(() => {
    setEditValue(title || 'New Sourcing Query');
    setIsEditing(false);
  }, [title, quoteId]);

  const handleStartEdit = () => {
    setEditValue(title || 'New Sourcing Query');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue && editValue.trim()) {
      onUpdateTitle(editValue.trim());
    } else {
      setEditValue(title || 'New Sourcing Query');
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(title || 'New Sourcing Query');
    setIsEditing(false);
  };

  return (
    <header className="h-11 px-5 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0 select-none z-10">
      {/* Quote Title and Edit CTA */}
      <div className="flex items-center gap-2 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <input
              type="text"
              data-cta="true"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              autoFocus
              className="px-2.5 py-1 text-sm font-semibold text-neutral-900 bg-neutral-50 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-500 focus:bg-white w-[260px] sm:w-[380px] transition-all"
              placeholder="Enter quote title..."
            />
            <button
              type="button"
              data-cta="true"
              onClick={handleSave}
              title="Save title (Enter)"
              className="w-7 h-7 rounded-full flex items-center justify-center text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer shrink-0"
            >
              <Check className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
            </button>
            <button
              type="button"
              data-cta="true"
              onClick={handleCancel}
              title="Cancel (Esc)"
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/80 transition-all cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 text-neutral-700 shrink-0" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0 group">
            <h1
              data-cta="true"
              onClick={handleStartEdit}
              title="Click to edit quote title"
              className="text-sm sm:text-base font-semibold text-neutral-900 tracking-tight truncate cursor-pointer hover:text-neutral-700 transition-colors"
            >
              {title || 'New Sourcing Query'}
            </h1>
            <button
              type="button"
              data-cta="true"
              onClick={handleStartEdit}
              title="Edit quote title"
              className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/80 transition-all cursor-pointer shrink-0 opacity-75 group-hover:opacity-100"
            >
              <Pencil className="w-3.5 h-3.5 text-neutral-700 shrink-0" strokeWidth={2} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
