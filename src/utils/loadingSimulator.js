import loadingPhrases from '../data/loadingPhrases.json';

/**
 * Randomly selects between 3 and 6 distinct phrases from loadingPhrases.json
 * @returns {string[]} Array of selected phrases (length 3 to 6)
 */
export function getSelectedLoadingPhrases() {
  const count = Math.floor(Math.random() * 4) + 3; // 3, 4, 5, or 6
  const list = Array.isArray(loadingPhrases) && loadingPhrases.length > 0
    ? [...loadingPhrases]
    : [
        'Parsing fabric requirements and composition constraints...',
        'Querying verified mill catalogues and warehouse inventory...',
        'Evaluating yarn counts, GSM densities, and blend tolerances...',
        'Checking NOOS continuity reserves...',
        'Structuring Make-To-Order technical specifications...',
        'Compiling comprehensive fabric quotation options...'
      ];

  // Fisher-Yates shuffle
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }

  return list.slice(0, Math.min(count, list.length));
}

/**
 * Executes the rotation cycle across selected phrases.
 * Each phrase is displayed for exactly 3000ms (3 seconds).
 * Total delay = phrases.length * 3000ms.
 *
 * @param {string[]} phrases - Selected phrases array
 * @param {(phrase: string, index: number, total: number) => void} onPhraseChange - Callback when phrase changes
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel execution
 * @returns {Promise<boolean>} Resolves true when cycle completed normally, false if aborted
 */
export async function runLoadingPhraseCycle(phrases, onPhraseChange, signal) {
  if (!phrases || phrases.length === 0) return true;

  for (let i = 0; i < phrases.length; i++) {
    if (signal && signal.aborted) {
      return false;
    }

    if (typeof onPhraseChange === 'function') {
      onPhraseChange(phrases[i], i, phrases.length);
    }

    // Wait exactly 3000ms for current phrase
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 3000);
      if (signal) {
        signal.addEventListener(
          'abort',
          () => {
            clearTimeout(timer);
            resolve();
          },
          { once: true }
        );
      }
    });

    if (signal && signal.aborted) {
      return false;
    }
  }

  return true;
}

/**
 * Runs a simulated restore checkpoint delay for 3 to 6 seconds.
 * @param {AbortSignal} [signal] - Optional AbortSignal to cancel execution
 * @returns {Promise<boolean>} Resolves true when duration completed, false if aborted
 */
export async function runRestoreCheckpointDelay(signal) {
  const duration = Math.floor(Math.random() * 3001) + 3000; // Random between 3000ms and 6000ms (3-6s)
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(true), duration);
    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          resolve(false);
        },
        { once: true }
      );
    }
  });
}

