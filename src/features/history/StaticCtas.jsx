import React from 'react';
import { Plus, Globe } from 'lucide-react';

/**
 * Static CTA buttons in the sidebar ("New Chat" and "Fabrito Website")
 */
export function StaticCtas({ isExpanded, onNewChat }) {
  const handleWebsiteClick = (e) => {
    e.stopPropagation();
    window.open('https://fabrito.com', '_blank', 'noopener,noreferrer');
  };

  const handleNewChatClick = (e) => {
    e.stopPropagation();
    onNewChat();
  };

  return (
    <div className="px-2.5 py-1.5 space-y-1 overflow-hidden">
      <button
        onClick={handleNewChatClick}
        className="w-full h-8 flex items-center justify-start px-0 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/80 rounded-full transition-all duration-200 cursor-pointer overflow-hidden"
        title="Start New Sourcing Chat"
      >
        <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-full">
          <Plus className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
        </div>
        <span
          className={`ml-2 transition-all duration-200 overflow-hidden whitespace-nowrap ${
            isExpanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none'
          }`}
        >
          New Chat
        </span>
      </button>

      <button
        onClick={handleWebsiteClick}
        className="w-full h-8 flex items-center justify-start px-0 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/80 rounded-full transition-all duration-200 cursor-pointer overflow-hidden"
        title="Visit Fabrito Website"
      >
        <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-full">
          <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        </div>
        <span
          className={`ml-2 transition-all duration-200 overflow-hidden whitespace-nowrap ${
            isExpanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none'
          }`}
        >
          Fabrito Website
        </span>
      </button>
    </div>
  );
}
