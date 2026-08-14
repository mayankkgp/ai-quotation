import React from 'react';

/**
 * BracketTagParser Component
 * Parses system reply text to extract bracketed metadata (e.g. "[GSM: 110, 140]")
 * and renders them as inline highlighted text.
 */
export function BracketTagParser({ text }) {
  if (!text) return null;

  // Regex matches any string enclosed in square brackets: e.g. "[Category: Value]"
  const bracketRegex = /(\[[^\]]+\])/g;

  // Split text into array of normal strings and bracketed strings
  const parts = text.split(bracketRegex);

  return (
    <span>
      {parts.map((part, index) => {
        // Check if current segment is enclosed in brackets
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span
              key={index}
              className="font-semibold text-zinc-900 bg-zinc-200/60 rounded-[2px] px-0.5"
            >
              {part}
            </span>
          );
        }

        // Standard text segment
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

