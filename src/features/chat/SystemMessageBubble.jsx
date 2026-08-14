import React from 'react';
import { BracketTagParser } from './BracketTagParser';

/**
 * SystemMessageBubble Component
 * Renders automated Fabrito system replies as full-bleed ledger rows with a subtle wash.
 */
export function SystemMessageBubble({ message, isLast }) {
  return (
    <div className={`w-full px-3 pt-2 pb-4 text-left bg-transparent ${isLast ? '' : 'border-b border-zinc-100'}`}>
      <div className="text-[13px] text-zinc-900 leading-snug">
        <BracketTagParser text={message.systemReply} />
      </div>
    </div>
  );
}

