import { useEffect, useState } from 'react';
import { initializeStorage, getAuthState, getChatHistory } from '../services/storageService';

/**
 * Root hook that initializes localStorage on application startup
 * and returns loading & initial storage state.
 */
export function useInitializeStorage() {
  const [isReady, setIsReady] = useState(false);
  const [authState, setAuthState] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      // Seed storage
      initializeStorage();
      
      // Fetch initial values with simulated network delay
      const currentAuth = await getAuthState();
      const currentHistory = await getChatHistory();

      if (isMounted) {
        setAuthState(currentAuth);
        setHistory(currentHistory);
        setIsReady(true);
      }
    }
    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isReady, authState, setAuthState, history, setHistory };
}
