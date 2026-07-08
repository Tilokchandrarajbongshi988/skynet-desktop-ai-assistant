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
import { detectAction } from '../services/actionRouterService.js';
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
    return getMessages(input.conversationId);
  }

  const conversationId = input.conversationId ?? getOrCreateConversation();
  saveMessage(conversationId, 'user', content);

  const action = detectAction(content);
  if (action) {
    saveMessage(
      conversationId,
      'assistant',
      'I can do that, but I need your permission first.',
    );

    return {
      messages: getMessages(conversationId),
      action,
    };
  }

  const memoryText = getRememberThatText(content);
  if (memoryText) {
    createMemory(memoryText);
    saveMessage(conversationId, 'assistant', "Got it, I'll remember that.");
    return { messages: getMessages(conversationId) };
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
  return { messages: getMessages(conversationId) };
}

function getRememberThatText(content: string) {
  const prefix = 'remember that';

  if (!content.toLowerCase().startsWith(prefix)) {
    return null;
  }

  return content.slice(prefix.length).trim();
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

  return `You are Luna, a privacy-first local desktop assistant.
You run locally on the user's computer.
You help with conversation, memory, notes, files, and desktop automation.
Keep responses practical and clear.

User name: ${userName || 'Unknown user'}
Assistant name: ${assistantName || 'Luna'}
Response style: ${responseStyle || 'balanced'}

Stored memories:

${memoryList}`;
}
