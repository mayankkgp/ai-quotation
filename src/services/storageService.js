import attributesData from '../data/attributes.json';
import chatData from '../data/chat.json';
import quotesData from '../data/quotes.json';
import { simulateNetwork } from '../utils/simulateNetwork';
import { getOrCreateQuotationData } from '../utils/quoteGenerator';

const KEYS = {
  HISTORY: 'fabrito_chat_history',
  MESSAGES: 'fabrito_chat_messages',
  ATTRIBUTES: 'fabrito_attributes',
  AUTH: 'fabrito_auth_user',
  GUEST: 'fabrito_guest_session',
  ACTIVE_CHAT: 'fabrito_active_chat_id'
};

/**
 * Initializes localStorage if keys are not present.
 */
export function initializeStorage() {
  const historyRaw = localStorage.getItem(KEYS.HISTORY);
  if (!historyRaw) {
    const validDefaultQuotes = quotesData.filter((item) => Array.isArray(item.chats) && item.chats.length > 0);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(validDefaultQuotes));
  } else {
    // Migration check: ensure every history item has a primary key id & filter out empty sessions
    const parsedHistory = JSON.parse(historyRaw);
    let needsUpdate = false;
    const validHistory = parsedHistory.filter((item, idx) => {
      if (!item.id) {
        item.id = quotesData[idx]?.id || `quote_${String(idx + 1).padStart(3, '0')}`;
        needsUpdate = true;
      }
      return Array.isArray(item.chats) && item.chats.length > 0;
    });
    if (needsUpdate || validHistory.length !== parsedHistory.length) {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(validHistory));
    }
  }
  if (!localStorage.getItem(KEYS.MESSAGES)) {
    const chatDataWithIds = (chatData || []).map((m, idx) => ({
      ...m,
      id: m.id || `msg_${m.chatId || 'default'}_${idx}`
    }));
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(chatDataWithIds));
  }
  if (!localStorage.getItem(KEYS.ATTRIBUTES)) {
    localStorage.setItem(KEYS.ATTRIBUTES, JSON.stringify(attributesData));
  }
  if (!localStorage.getItem(KEYS.AUTH)) {
    const defaultAuth = {
      isLoggedIn: true,
      user: {
        name: 'Narain Mayank',
        initials: 'NM',
        email: 'narainmayank@gmail.com'
      }
    };
    localStorage.setItem(KEYS.AUTH, JSON.stringify(defaultAuth));
  }
  if (!localStorage.getItem(KEYS.GUEST)) {
    const defaultGuest = {
      createdAt: Date.now(),
      guestId: 'guest_' + Math.random().toString(36).substring(2, 9)
    };
    localStorage.setItem(KEYS.GUEST, JSON.stringify(defaultGuest));
  }
}

/**
 * Reads all chat history sessions.
 */
export async function getChatHistory() {
  await simulateNetwork(300);
  initializeStorage();
  const raw = localStorage.getItem(KEYS.HISTORY);
  const history = raw ? JSON.parse(raw) : [];
  return history.filter((item) => Array.isArray(item.chats) && item.chats.length > 0);
}

/**
 * Reads chat messages for a given quoteId history item.
 */
export async function getChatMessages(quoteId) {
  await simulateNetwork(250);
  initializeStorage();
  const raw = localStorage.getItem(KEYS.MESSAGES);
  const allMessages = raw ? JSON.parse(raw) : [];

  let result = [];
  if (!quoteId) {
    result = allMessages;
  } else {
    // Retrieve history to find mapped history item by primary key id
    const historyRaw = localStorage.getItem(KEYS.HISTORY);
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    const historyItem = history.find((h) => h.id === quoteId);

    if (historyItem && Array.isArray(historyItem.chats) && historyItem.chats.length > 0) {
      const chatSet = new Set(historyItem.chats);
      result = allMessages.filter((m) => chatSet.has(m.chatId));
    } else {
      // Fallback: exact chatId match if quoteId is fallback or single chatId
      const exact = allMessages.filter((m) => m.chatId === quoteId);
      if (exact.length > 0) {
        result = exact;
      } else {
        result = [];
      }
    }
  }

  // Ensure every message object has a stable unique ID
  return result.map((m, idx) => ({
    ...m,
    id: m.id || `msg_${m.chatId || 'default'}_${idx}`
  }));
}

/**
 * Reads attributes configuration.
 */
export async function getAttributes() {
  await simulateNetwork(150);
  initializeStorage();
  const raw = localStorage.getItem(KEYS.ATTRIBUTES);
  return raw ? JSON.parse(raw) : attributesData;
}

/**
 * Reads current auth state.
 */
export async function getAuthState() {
  await simulateNetwork(200);
  initializeStorage();
  const raw = localStorage.getItem(KEYS.AUTH);
  return raw ? JSON.parse(raw) : { isLoggedIn: false, user: null };
}

/**
 * Updates auth state in localStorage.
 */
export async function updateAuthState(authObj) {
  await simulateNetwork(350);
  localStorage.setItem(KEYS.AUTH, JSON.stringify(authObj));
  return authObj;
}

/**
 * Merges guest session history into main history when logging in.
 */
export async function mergeGuestSession() {
  await simulateNetwork(400);
  const history = await getChatHistory();
  // Ensure default sessions are populated or merged
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  return true;
}

/**
 * Adds a new chat entry to an existing or new quote session.
 */
export async function sendChatMessage(quoteId, userInput, customTitle, options = {}) {
  if (!options?.skipDelay) {
    await simulateNetwork(450);
  }
  initializeStorage();
  const messagesRaw = localStorage.getItem(KEYS.MESSAGES);
  const messages = messagesRaw ? JSON.parse(messagesRaw) : [];

  const newChatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

  // Generate smart system reply with filter tags
  const systemReply = generateSystemReply(userInput);

  const newChatMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    chatId: newChatId,
    userInput,
    systemReply
  };

  messages.push(newChatMsg);
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));

  // Update or create quote history item ONLY when system quote is provided
  const historyRaw = localStorage.getItem(KEYS.HISTORY);
  let history = historyRaw ? JSON.parse(historyRaw) : [];

  let historyItem = history.find((h) => h.id === quoteId);

  if (historyItem) {
    if (!Array.isArray(historyItem.chats)) {
      historyItem.chats = [];
    }
    historyItem.chats.push(newChatId);
    if (customTitle) {
      historyItem.title = customTitle;
    }
    const quoteData = getOrCreateQuotationData(historyItem.id);
    if (quoteData?.matchCountString) {
      historyItem.matchCount = quoteData.matchCountString;
    }
  } else {
    // Create new quote session in history since system provided a quote
    const newQuoteId = quoteId && quoteId.startsWith('quote_') ? quoteId : `quote_${Date.now()}`;
    const newTitle = customTitle || generateSessionTitle(userInput);
    const quoteData = getOrCreateQuotationData(newQuoteId);
    historyItem = {
      id: newQuoteId,
      title: newTitle,
      matchCount: quoteData.matchCountString || '0 Matches',
      timestamp: new Date().toISOString().split('T')[0],
      chats: [newChatId]
    };
    history.unshift(historyItem);
  }

  const validHistory = history.filter((h) => Array.isArray(h.chats) && h.chats.length > 0);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(validHistory));
  return { message: newChatMsg, history: validHistory, quoteId: historyItem.id };
}

/**
 * Updates the title of a quote item in history.
 */
export async function updateQuoteTitle(quoteId, newTitle) {
  initializeStorage();
  const historyRaw = localStorage.getItem(KEYS.HISTORY);
  let history = historyRaw ? JSON.parse(historyRaw) : [];
  let historyItem = history.find((h) => h.id === quoteId);

  if (historyItem) {
    historyItem.title = newTitle;
    const validHistory = history.filter((h) => Array.isArray(h.chats) && h.chats.length > 0);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(validHistory));
    return validHistory;
  }

  // If no quote has been provided by system yet, do not add empty session to history
  return history.filter((h) => Array.isArray(h.chats) && h.chats.length > 0);
}

/**
 * Helper to generate a contextual system reply with attribute tags
 */
function generateSystemReply(input) {
  const lower = input.toLowerCase();
  let tags = [];

  if (lower.includes('woven') || lower.includes('dress') || lower.includes('shirt')) {
    tags.push('[Fabric Type: Woven]');
  } else {
    tags.push('[Fabric Type: Knit]');
  }

  if (lower.includes('cotton')) tags.push('[Composition: 100% Cotton]');
  if (lower.includes('linen')) tags.push('[Content: Linen]');
  if (lower.includes('black')) tags.push('[Color: Jet Black]');
  if (lower.includes('white')) tags.push('[Color: Optic White]');
  if (lower.includes('blue') || lower.includes('navy')) tags.push('[Color: Navy Blue]');
  if (lower.includes('pink') || lower.includes('blush')) tags.push('[Color: Blush]');

  // Quantity extraction
  const qtyMatch = input.match(/(\d+)/);
  const qty = qtyMatch ? qtyMatch[1] : '2500';
  tags.push(`[Available Quantity: ${qty}]`);

  const tagString = tags.join(' ');
  return `I've processed your sourcing query for "${input}". Applied exact filters ${tagString} to refine available Stock, NOOS, and MTO options for your target specifications.`;
}

/**
 * Generates a concise title from user prompt
 */
function generateSessionTitle(input) {
  const words = input.trim().split(/\s+/).slice(0, 4).join(' ');
  return words.length > 0 ? words.charAt(0).toUpperCase() + words.slice(1) : 'Fabric Sourcing Query';
}
