import React, { useEffect, useRef } from 'react';
import { PanelLeftClose, PanelLeft, Layers } from 'lucide-react';
import { StaticCtas } from './StaticCtas';
import { HistoryList } from './HistoryList';
import { AuthSwitcher } from './AuthSwitcher';

/**
 * Collapsible Sidebar Navigation Component
 */
export function Sidebar({
  isExpanded,
  onToggleExpand,
  historyItems,
  activeChatId,
  onSelectChat,
  onNewChat,
  authState,
  onAuthChange
}) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event) => {
      const target = event.target;
      if (!target) return;

      // 1. If click is inside the sidebar itself, do not collapse
      if (sidebarRef.current && sidebarRef.current.contains(target)) {
        return;
      }

      // 2. If click is inside the chat text input box (textarea), collapse sidebar
      if (target.closest('textarea') || target.closest('[data-text-input="true"]')) {
        onToggleExpand(false);
        return;
      }

      // 3. If click is on any CTA, button, link, card, form, or interactive element in quotes/chat, do not collapse
      const isCta = target.closest('button, a, [role="button"], [data-cta="true"], input, select, form, label');
      if (isCta) {
        return;
      }

      // 4. Clicking on empty space (in quotes area, chat area, background, etc.) collapses sidebar
      onToggleExpand(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, onToggleExpand]);

  const handleSidebarContainerClick = (e) => {
    // If collapsed, clicking anywhere on the background container expands the sidebar
    if (!isExpanded) {
      onToggleExpand(true);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      onClick={handleSidebarContainerClick}
      title={!isExpanded ? 'Click to expand sidebar' : undefined}
      className={`h-full border-r border-neutral-200 bg-neutral-100 flex flex-col transition-all duration-200 select-none ${
        isExpanded ? 'w-60' : 'w-12 cursor-e-resize'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-11 px-2.5 flex items-center justify-between shrink-0 bg-neutral-100 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0">
          <div
            onClick={(e) => {
              if (!isExpanded) {
                e.stopPropagation();
                onToggleExpand(true);
              }
            }}
            className={`w-7 h-7 rounded-full text-neutral-900 flex items-center justify-center shrink-0 transition-colors ${
              !isExpanded ? 'cursor-pointer hover:bg-neutral-200/80' : ''
            }`}
            title="Fabrito Sourcing"
          >
            <Layers className="w-4 h-4 shrink-0" />
          </div>

          <div
            className={`min-w-0 transition-all duration-200 overflow-hidden whitespace-nowrap ${
              isExpanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            <h1 className="text-xs font-bold text-neutral-900 truncate tracking-tight">
              Fabrito Sourcing
            </h1>
            <p className="text-[9px] text-neutral-500 font-mono tracking-wider uppercase">
              B2B Workspace
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-neutral-700 hover:text-neutral-900 hover:bg-neutral-200/80 transition-all duration-200 shrink-0 cursor-pointer ${
            isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="w-5 h-5 shrink-0" />
        </button>
      </div>

      {/* Static CTAs */}
      <StaticCtas isExpanded={isExpanded} onNewChat={onNewChat} />

      {/* History List */}
      <HistoryList
        isExpanded={isExpanded}
        historyItems={historyItems}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
      />

      {/* Auth Switcher Footer */}
      <AuthSwitcher
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        authState={authState}
        onAuthChange={onAuthChange}
      />
    </aside>
  );
}
