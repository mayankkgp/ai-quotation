import React, { useState, useRef } from 'react';
import { CornerDownLeft } from 'lucide-react';

/**
 * ChatInput Component
 * Command Bar anchored at the absolute bottom of the chat pane with auto-expanding textarea.
 */
export function ChatInput({
  onSendMessage,
  isSending,
  inputText: propInputText,
  setInputText: propSetInputText,
  textareaRef: propTextareaRef
}) {
  const [internalText, setInternalText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef(null);

  const isControlled = propInputText !== undefined && propSetInputText !== undefined;
  const inputText = isControlled ? propInputText : internalText;
  const setInputText = isControlled ? propSetInputText : setInternalText;
  const textareaRef = propTextareaRef || internalRef;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInputText(val);
    e.target.style.height = 'auto';
    if (val) {
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasText = inputText.trim().length > 0;

  return (
    <div className="w-full px-4 shrink-0">
      <div
        className={`max-w-4xl mx-auto mb-6 bg-white border rounded-xl shadow-sm transition-colors duration-150 ${
          isFocused ? 'border-zinc-400' : 'border-zinc-200'
        }`}
      >
        <form onSubmit={handleSubmit} className="relative w-full px-3.5 py-2.5 flex items-end">
          <textarea
            ref={textareaRef}
            data-text-input="true"
            value={inputText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isSending}
            placeholder="Describe your requirement"
            className="w-full resize-none p-0 text-[13px] leading-snug text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none focus:ring-0 border-0 disabled:opacity-50 min-h-[20px] max-h-[90px] pr-8"
            rows={1}
          />

          <button
            type="submit"
            data-cta="true"
            disabled={!hasText || isSending}
            className={`absolute right-3 bottom-2.5 p-1 transition-colors ${
              hasText && !isSending
                ? 'text-[#ca3028] cursor-pointer hover:text-[#a82720]'
                : 'text-zinc-300 cursor-not-allowed'
            }`}
            title="Submit requirement"
          >
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

