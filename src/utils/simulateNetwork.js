/**
 * Simulates network latency for asynchronous CRUD operations.
 * @param {number} delay - Time in milliseconds to wait before resolving.
 * @returns {Promise<void>}
 */
export function simulateNetwork(delay = 400) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
