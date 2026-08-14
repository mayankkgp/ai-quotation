import React from 'react';
import { Undo2, Flag } from 'lucide-react';

/**
 * UserMessageBubble Component
 * Renders user inputs as full-bleed, left-aligned ledger rows with micro-padding.
 */
export function UserMessageBubble({ message, showRestore = true, onRestore, isRestored = false, disabled = false }) {
  const handleSnapshotClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onRestore) {
      onRestore(message);
    }
  };

  const isRestoreMsg =
    message?.userInput?.toLowerCase().trim() === 'restore checkpoint' ||
    message?.id?.startsWith('msg_restore_');
  const canShowRestore = showRestore && !isRestoreMsg;

  return (
    <div className="max-w-[85%] ml-auto px-3 pt-4 pb-2 bg-transparent flex items-start justify-end gap-2">
      {/* Active Checkpoint Flag OR Hover Snapshot/Restore CTA button */}
      {isRestored ? (
        <span
          className="w-6 h-6 rounded-full bg-neutral-200/80 text-neutral-800 shrink-0 flex items-center justify-center -mt-0.5"
          title="Active restored checkpoint"
        >
          <Flag className="w-3.5 h-3.5 fill-neutral-800 text-neutral-800" />
        </span>
      ) : canShowRestore ? (
        <button
          type="button"
          data-cta="true"
          disabled={disabled}
          onClick={handleSnapshotClick}
          className={`opacity-0 group-hover:opacity-100 transition-all duration-150 w-6 h-6 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/80 cursor-pointer shrink-0 -mt-0.5 ${
            disabled ? 'pointer-events-none opacity-40 cursor-not-allowed' : ''
          }`}
          title="Restore state to this point in conversation"
        >
          <Undo2 className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      ) : null}

      <div className="text-[13px] text-zinc-900 leading-snug text-left">
        {message.userInput}
      </div>
    </div>
  );
}

