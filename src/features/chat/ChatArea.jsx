import React, { useState, useRef } from 'react';
import { ChatFeed } from './ChatFeed';
import { ChatInput } from './ChatInput';

/**
 * ChatArea Component
 * Primary center pane shell managing active chat feed and input submission.
 */
export function ChatArea({
  messages,
  isSending,
  isProcessing,
  isSessionLoading = false,
  currentLoadingPhrase,
  onSendMessage,
  onStartNewQuery,
  onRestore,
  restoredCheckpointId,
  onSelectPrompt
}) {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  const handleSelectPrompt = (promptText) => {
    if (onSelectPrompt) {
      onSelectPrompt(promptText);
    }
    setInputText(promptText);
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      }, 0);
    }
  };

  return (
    <section className="flex-[1] min-w-0 h-full flex flex-col bg-white border-r border-neutral-200/80 overflow-hidden">
      {/* Main Conversation Feed */}
      <ChatFeed
        messages={messages}
        isSending={isSending}
        isProcessing={isProcessing}
        isSessionLoading={isSessionLoading}
        currentLoadingPhrase={currentLoadingPhrase}
        onStartNewQuery={onStartNewQuery}
        onRestore={onRestore}
        restoredCheckpointId={restoredCheckpointId}
        onSelectPrompt={handleSelectPrompt}
      />

      {/* Permanently Anchored Bottom Chat Input */}
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        textareaRef={textareaRef}
        onSendMessage={onSendMessage}
        isSending={isSending || isProcessing || isSessionLoading}
      />
    </section>
  );
}


