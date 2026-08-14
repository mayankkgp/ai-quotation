import React from 'react';
import { MessageSquare } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (!isNaN(day) && monthIdx >= 0 && monthIdx < 12) {
      const formattedDay = String(day).padStart(2, '0');
      return `${formattedDay} ${months[monthIdx]}`;
    }
  }
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[date.getMonth()]}`;
  }
  return dateStr;
}

/**
 * List of historical fabric sourcing chats
 */
export function HistoryList({ isExpanded, historyItems, activeQuoteId, activeChatId, onSelectChat }) {
  const currentActiveQuoteId = activeQuoteId || activeChatId;

  return (
    <div
      className={`flex-1 overflow-y-auto overflow-x-hidden py-1.5 px-2.5 transition-opacity duration-200 ${
        isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-[224px] min-w-[224px] space-y-0.5">
        <div className="px-1.5 pb-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center justify-between whitespace-nowrap">
          <span>Recent Quotes</span>
        </div>

        {historyItems.length === 0 ? (
          <div className="p-3 text-center text-xs text-neutral-400 whitespace-nowrap">
            No chat history yet
          </div>
        ) : (
          historyItems.map((item, idx) => {
            const isActive = item.id === currentActiveQuoteId;

            return (
              <button
                key={item.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.id) onSelectChat(item.id);
                }}
                className={`w-full text-left p-2 rounded-md transition-colors group relative border cursor-pointer ${
                  isActive
                    ? 'bg-white border-neutral-900/80 text-neutral-900 shadow-2xs font-medium'
                    : 'border-transparent text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-900'
                }`}
              >
                <div className={`font-medium text-xs truncate ${isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-700 group-hover:text-neutral-900'}`}>
                  {item.title}
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-500">
                  <span className={`text-[10px] tracking-tight ${
                    isActive ? 'text-neutral-800' : 'text-neutral-500'
                  }`}>
                    {item.matchCount}
                  </span>

                  <span className="text-neutral-400 text-[10px]">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
