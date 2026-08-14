import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../history/Sidebar';
import { ChatArea } from '../chat/ChatArea';
import { QuotationArea } from '../quotations/QuotationArea';
import { QuoteHeader } from './QuoteHeader';
import { getChatMessages, sendChatMessage, updateQuoteTitle } from '../../services/storageService';
import {
  getSelectedLoadingPhrases,
  runLoadingPhraseCycle,
  runRestoreCheckpointDelay
} from '../../utils/loadingSimulator';

/**
 * WorkspaceController Feature Orchestrator Component
 * Isolates workspace feature state (sidebar expansion, active chat thread, messages feed)
 * from the top-level global layout shell.
 * Orchestrates synchronized loading phrases and parallel updates for Chat and Quotations.
 */
export function WorkspaceController({ history: initialHistory, authState, onAuthChange }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeQuoteId, setActiveQuoteId] = useState(() => `quote_${Date.now()}`);
  const [historyItems, setHistoryItems] = useState(initialHistory || []);
  const [customTitles, setCustomTitles] = useState({});
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLoadingPhrase, setCurrentLoadingPhrase] = useState('');
  const [restoredCheckpointId, setRestoredCheckpointId] = useState(null);

  const abortControllerRef = useRef(null);
  const lastLoadedQuoteIdRef = useRef(null);

  // Sync history when props update
  useEffect(() => {
    if (initialHistory && initialHistory.length > 0) {
      // Ensure only sessions with system quotes/chats are displayed in sidebar
      const validHistory = initialHistory.filter((item) => Array.isArray(item.chats) && item.chats.length > 0);
      setHistoryItems(validHistory);
    }
  }, [initialHistory]);

  // Clean up any ongoing loading cycles on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Load chat thread messages whenever activeQuoteId changes externally on initial load
  useEffect(() => {
    let isMounted = true;

    async function fetchThreadMessages() {
      setIsLoading(true);
      try {
        const threadMsgs = await getChatMessages(activeQuoteId);
        if (isMounted) {
          if (threadMsgs && threadMsgs.length > 0) {
            const threadMsgsWithIds = threadMsgs.map((m, idx) => ({
              ...m,
              id: m.id || `msg_${m.chatId || activeQuoteId || 'session'}_${idx}`
            }));
            setMessages(threadMsgsWithIds);
          } else {
            setMessages([]);
          }
          setRestoredCheckpointId(null);
        }
      } catch (err) {
        console.error('Failed to load chat messages:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (activeQuoteId && lastLoadedQuoteIdRef.current !== activeQuoteId) {
      lastLoadedQuoteIdRef.current = activeQuoteId;
      fetchThreadMessages();
    }
  }, [activeQuoteId]);

  // Handler to select a quote session from history (shows skeleton loading UI)
  const handleSelectChat = async (quoteId) => {
    if (quoteId === activeQuoteId && !isSessionLoading && !isProcessing) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    lastLoadedQuoteIdRef.current = quoteId;
    setActiveQuoteId(quoteId);
    setRestoredCheckpointId(null);
    setIsProcessing(false);
    setIsSending(false);
    setCurrentLoadingPhrase('');
    setIsSessionLoading(true);

    try {
      // Fetch thread messages while showing clean skeleton transition
      const [threadMsgs] = await Promise.all([
        getChatMessages(quoteId),
        new Promise((resolve) => setTimeout(resolve, 450))
      ]);

      if (abortController.signal.aborted) return;

      if (threadMsgs && threadMsgs.length > 0) {
        const threadMsgsWithIds = threadMsgs.map((m, idx) => ({
          ...m,
          id: m.id || `msg_${m.chatId || quoteId || 'session'}_${idx}`
        }));
        setMessages(threadMsgsWithIds);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to select chat:', err);
    } finally {
      if (!abortController.signal.aborted) {
        setIsSessionLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  // Handler to start a new quote query session
  const handleNewChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setIsSending(false);
    setIsSessionLoading(false);
    setCurrentLoadingPhrase('');
    const newQuoteId = `quote_${Date.now()}`;
    lastLoadedQuoteIdRef.current = newQuoteId;
    setActiveQuoteId(newQuoteId);
    setMessages([]);
    setRestoredCheckpointId(null);
    setIsSidebarExpanded(false);

    // Automatically bring the text input field in focus
    setTimeout(() => {
      const textarea = document.querySelector('textarea[data-text-input="true"]');
      if (textarea) {
        textarea.focus();
      }
    }, 50);
  };

  // Handler to update quote title
  const handleUpdateTitle = async (newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    const trimmed = newTitle.trim();

    setCustomTitles((prev) => ({ ...prev, [activeQuoteId]: trimmed }));

    const existsInHistory = historyItems.some((item) => item.id === activeQuoteId);
    if (existsInHistory) {
      setHistoryItems((prev) =>
        prev.map((item) =>
          item.id === activeQuoteId ? { ...item, title: trimmed } : item
        )
      );
      await updateQuoteTitle(activeQuoteId, trimmed);
    }
  };

  // Handler to send a user message with synchronized multi-step loading cycle
  const handleSendMessage = async (userInput) => {
    setRestoredCheckpointId(null);

    // Abort any ongoing loading cycle
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Immediately trigger global loading state and append pending user message
    const tempChatId = `chat_${Date.now()}`;
    const tempMsgId = `msg_pending_${Date.now()}`;
    const pendingMsg = {
      id: tempMsgId,
      chatId: tempChatId,
      userInput,
      systemReply: null,
      isPending: true
    };

    setMessages((prev) => [...prev, pendingMsg]);
    setIsSending(true);
    setIsProcessing(true);

    // Randomly select between 3 and 6 phrases
    const selectedPhrases = getSelectedLoadingPhrases();

    // Run timed rotation: each phrase displays for exactly 3 seconds (3000ms)
    const completed = await runLoadingPhraseCycle(
      selectedPhrases,
      (phrase) => {
        setCurrentLoadingPhrase(phrase);
      },
      abortController.signal
    );

    if (!completed || abortController.signal.aborted) {
      return;
    }

    // Timer completed: resolve Chat reply and Quotation updates simultaneously
    try {
      const customTitle = customTitles[activeQuoteId];
      const res = await sendChatMessage(activeQuoteId, userInput, customTitle, { skipDelay: true });
      if (res && res.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsgId ? res.message : m))
        );
        if (res.quoteId && res.quoteId !== activeQuoteId) {
          lastLoadedQuoteIdRef.current = res.quoteId;
          setActiveQuoteId(res.quoteId);
        }
        if (res.history) {
          setHistoryItems(res.history);
        }
      }
    } catch (err) {
      console.error('Failed to send chat message:', err);
    } finally {
      setIsSending(false);
      setIsProcessing(false);
      setCurrentLoadingPhrase('');
      abortControllerRef.current = null;
    }
  };

  // Handler when restore checkpoint CTA is clicked
  const handleRestoreCheckpoint = async (targetMessage) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    if (targetMessage?.id) {
      setRestoredCheckpointId(targetMessage.id);
    }

    setIsSending(true);
    setIsProcessing(true);
    setCurrentLoadingPhrase('Restoring checkpoint...');

    const completed = await runRestoreCheckpointDelay(abortController.signal);
    if (!completed || abortController.signal.aborted) {
      return;
    }

    try {
      const restoreMessage = {
        chatId: activeQuoteId || `chat_${Date.now()}`,
        id: `msg_restore_${Date.now()}`,
        userInput: "Restore Checkpoint",
        systemReply: "Checkpoint successfully restored"
      };

      // Keep the full sequence of previous messages intact without slicing or reordering
      setMessages((prev) => [...prev, restoreMessage]);
    } finally {
      setIsSending(false);
      setIsProcessing(false);
      setCurrentLoadingPhrase('');
      abortControllerRef.current = null;
    }
  };

  // Resolve active session title for the header
  const activeHistoryItem = historyItems?.find(
    (item) => item.id === activeQuoteId
  );
  const activeTitle = customTitles[activeQuoteId] || activeHistoryItem?.title || 'New Sourcing Query';

  return (
    <>
      {/* Pane 1: Collapsible Sidebar Navigation */}
      <Sidebar
        isExpanded={isSidebarExpanded}
        onToggleExpand={setIsSidebarExpanded}
        historyItems={historyItems}
        activeChatId={activeQuoteId}
        activeQuoteId={activeQuoteId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        authState={authState}
        onAuthChange={onAuthChange}
      />

      {/* Main Container Spanning Chat Area (Pane 2) and Quotation Area (Pane 3) */}
      <div className="flex-1 min-w-0 h-full flex flex-col overflow-hidden bg-white">
        {/* Thin Header Spanning Chat and Quotations */}
        <QuoteHeader
          title={activeTitle}
          quoteId={activeQuoteId}
          onUpdateTitle={handleUpdateTitle}
        />

        {/* Split View Body */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Pane 2: Center Interactive Chat Area */}
          <ChatArea
            messages={messages}
            isSending={isSending}
            isProcessing={isProcessing}
            isSessionLoading={isSessionLoading}
            currentLoadingPhrase={currentLoadingPhrase}
            onSendMessage={handleSendMessage}
            onStartNewQuery={handleNewChat}
            onRestore={handleRestoreCheckpoint}
            restoredCheckpointId={restoredCheckpointId}
          />

          {/* Pane 3: Right Dedicated Quotation Area */}
          <QuotationArea
            activeQuoteId={activeQuoteId}
            authState={authState}
            messages={messages}
            isProcessing={isProcessing}
            isSessionLoading={isSessionLoading}
            currentLoadingPhrase={currentLoadingPhrase}
          />
        </div>
      </div>
    </>
  );
}
