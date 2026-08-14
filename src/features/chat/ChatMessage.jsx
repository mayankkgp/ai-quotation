import React from 'react';
import { UserMessageBubble } from './UserMessageBubble';
import { SystemMessageBubble } from './SystemMessageBubble';

/**
 * ChatMessage Component
 * Combines a user input and its corresponding system reply into sequential ledger rows.
 */
export function ChatMessage({ message, isLastMessage, isSending, onRestore, isRestored }) {
  if (!message) return null;

  return (
    <div className="group">
      {message.userInput && (
        <UserMessageBubble
          message={message}
          showRestore={!isLastMessage}
          onRestore={onRestore}
          isRestored={isRestored}
          disabled={isSending}
        />
      )}
      {message.systemReply && (
        <SystemMessageBubble message={message} isLast={isLastMessage && !isSending} />
      )}
    </div>
  );
}

