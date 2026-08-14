import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { EmptyChatState } from './EmptyChatState';
import { ChatSkeleton } from './ChatSkeleton';
import { Loader2 } from 'lucide-react';

/**
 * ChatFeed Component
 * Manages the scrolling full-bleed ledger feed of messages.
 */
export function ChatFeed({
  messages,
  isSending,
  isProcessing,
  isSessionLoading = false,
  currentLoadingPhrase,
  onStartNewQuery,
  onRestore,
  restoredCheckpointId,
  onSelectPrompt
}) {
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change or typing state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isProcessing, currentLoadingPhrase]);

  // If a quote session is being loaded from history/sidebar, display the chat skeleton
  if (isSessionLoading) {
    return <ChatSkeleton />;
  }

  const isActivelyLoading = isSending || isProcessing;

  if (!messages || messages.length === 0) {
    if (isActivelyLoading) {
      return (
        <div className="flex-1 overflow-y-auto w-full flex flex-col justify-end p-4">
          <div className="w-full px-3 py-2 text-left bg-transparent flex items-center gap-2 text-[13px] text-neutral-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400 shrink-0" />
            <span
              key={currentLoadingPhrase || 'default-loading-phrase'}
              className="text-neutral-500 italic font-normal tracking-normal transition-opacity duration-300"
            >
              {currentLoadingPhrase || 'Restoring checkpoint...'}
            </span>
          </div>
          <div ref={bottomRef} />
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyChatState onSelectPrompt={onSelectPrompt} onStartNewQuery={onStartNewQuery} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto w-full flex flex-col">
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg.id || msg.chatId || index}
          message={msg}
          isLastMessage={index === messages.length - 1}
          isSending={isActivelyLoading}
          onRestore={onRestore}
          isRestored={msg.id === restoredCheckpointId}
        />
      ))}

      {/* Loading / Processing row with rotating dynamic phrase (no background, distinct loading typography) */}
      {isActivelyLoading && (
        <div className="w-full px-3 py-2 text-left bg-transparent flex items-center gap-2 text-[13px] text-neutral-500">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400 shrink-0" />
          <span
            key={currentLoadingPhrase || 'default-loading-phrase'}
            className="text-neutral-500 italic font-normal tracking-normal transition-opacity duration-300"
          >
            {currentLoadingPhrase || 'Analyzing fabric specifications & generating quotation...'}
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

