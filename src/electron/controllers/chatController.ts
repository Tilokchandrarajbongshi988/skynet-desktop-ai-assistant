import type { IpcMain } from 'electron';
import {
  getMessages,
  getOrCreateConversation,
  getRecentMessages,
  saveMessage,
} from '../models/chatModel.js';
import { getMemories } from '../models/memoryModel.js';
import { createMemory } from '../models/memoryModel.js';
import { getSettings } from '../models/settingsModel.js';
import { detectAction, getBlockedActionMessage } from '../services/actionRouterService.js';
import type { SkynetAction } from '../services/actionRouterService.js';
import { chatWithOllama } from '../services/ollamaService.js';

type SendMessageInput = {
  conversationId?: number;
  content: string;
};

export function registerChatController(ipcMain: IpcMain) {
  ipcMain.handle('chat:getMessages', () => getMessages());
  ipcMain.handle('chat:sendMessage', (_event, input: SendMessageInput) => sendMessage(input));
}

async function sendMessage(input: SendMessageInput) {
  const content = input.content.trim();

  if (!content) {
    return {
      mode: 'chat',
      assistantMessage: '',
      messages: getMessages(input.conversationId),
    };
  }

  const conversationId = input.conversationId ?? getOrCreateConversation();
  saveMessage(conversationId, 'user', content);

  const blockedActionMessage = getBlockedActionMessage(content);
  if (blockedActionMessage) {
    saveMessage(conversationId, 'assistant', blockedActionMessage);

    return {
      mode: 'chat',
      assistantMessage: blockedActionMessage,
      messages: getMessages(conversationId),
    };
  }

  const action = detectAction(content);
  if (action) {
    const assistantMessage = getActionConfirmationMessage(action);
    saveMessage(conversationId, 'assistant', assistantMessage);

    return {
      mode: 'action_confirmation',
      assistantMessage,
      messages: getMessages(conversationId),
      action,
    };
  }

  const memoryText = getRememberThatText(content);
  if (memoryText) {
    createMemory(memoryText);
    const assistantMessage = "Got it, I'll remember that.";
    saveMessage(conversationId, 'assistant', assistantMessage);
    return {
      mode: 'chat',
      assistantMessage,
      messages: getMessages(conversationId),
    };
  }

  const settings = getSettings();
  const memories = getMemories();
  const recentMessages = getRecentMessages(conversationId);
  const assistantResponse = await chatWithOllama({
    modelName: settings.modelName,
    systemPrompt: buildSystemPrompt({
      userName: settings.userName,
      assistantName: settings.assistantName,
      responseStyle: settings.responseStyle,
      memories: memories.map((memory) => memory.content),
    }),
    messages: recentMessages,
  });

  saveMessage(conversationId, 'assistant', assistantResponse);
  return {
    mode: 'chat',
    assistantMessage: assistantResponse,
    messages: getMessages(conversationId),
  };
}

function getActionConfirmationMessage(action: SkynetAction) {
  if (action.type === 'OPEN_FOLDER') {
    return `I can open your ${action.folderName} folder. Please confirm before I continue.`;
  }

  return 'I can do that. Please confirm before I continue.';
}

function getRememberThatText(content: string) {
  const normalizedContent = content.toLowerCase();
  const prefixes = [
    'remember that',
    'remember this',
    'remember my',
    'remember i',
    'remember',
  ];
  const prefix = prefixes.find((candidate) => normalizedContent.startsWith(candidate));

  if (!prefix) {
    return null;
  }

  const memoryText = content.slice(prefix.length).trim();

  if (prefix === 'remember my') {
    return `my ${memoryText}`;
  }

  if (prefix === 'remember i') {
    return `I ${memoryText}`;
  }

  return memoryText;
}

function buildSystemPrompt({
  userName,
  assistantName,
  responseStyle,
  memories,
}: {
  userName: string;
  assistantName: string;
  responseStyle: string;
  memories: string[];
}) {
  const memoryList =
    memories.length > 0
      ? memories.map((memory) => `* ${memory}`).join('\n')
      : '* No stored memories yet.';

  return `You are Skynet, a privacy-first local desktop assistant.
You run locally on the user's computer.
You help with conversation, memory, notes, files, and desktop automation.
Keep responses practical and clear.

User name: ${userName || 'Unknown user'}
Assistant name: ${assistantName || 'Skynet'}
Response style: ${responseStyle || 'balanced'}

Stored memories:

${memoryList}`;
}
