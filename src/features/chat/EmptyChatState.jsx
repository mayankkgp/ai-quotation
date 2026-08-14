import React from 'react';

const STARTER_PROMPTS = [
  "100% Cotton for summer dresses, 5000m",
  "Heavy denim for winter jackets",
  "Stretch nylon activewear leggings"
];

/**
 * Empty Chat State Placeholder for New Chat
 * Features refined micro-SaaS typography and actionable starter prompt pills.
 */
export function EmptyChatState({ onSelectPrompt }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto my-auto select-none space-y-3">
      <h2 className="text-sm font-medium text-neutral-600 tracking-tight leading-snug">
        How can I assist you in fabric sourcing?
      </h2>

      {/* Starter Prompt Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-md pt-1">
        {STARTER_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            type="button"
            data-cta="true"
            onClick={() => onSelectPrompt && onSelectPrompt(prompt)}
            className="border border-neutral-200/80 bg-white hover:bg-neutral-50 text-[11px] text-neutral-700 px-3 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

