import type { ChatMessageRecord } from '../models/chatModel.js';

const OLLAMA_CHAT_URL = 'http://localhost:11434/api/chat';
const DEFAULT_MODEL = 'qwen2.5:3b-instruct';
const OLLAMA_NOT_RUNNING_MESSAGE =
  'Ollama is not running. Please start Ollama and make sure qwen2.5:3b-instruct is installed.';

type OllamaChatOptions = {
  modelName?: string;
  systemPrompt: string;
  messages: ChatMessageRecord[];
};

type OllamaResponse = {
  message?: {
    content?: string;
  };
};

export async function chatWithOllama({ modelName, systemPrompt, messages }: OllamaChatOptions) {
  try {
    const response = await fetch(OLLAMA_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelName || DEFAULT_MODEL,
        stream: false,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      return OLLAMA_NOT_RUNNING_MESSAGE;
    }

    const data = (await response.json()) as OllamaResponse;
    return data.message?.content?.trim() || 'I could not generate a response.';
  } catch {
    return OLLAMA_NOT_RUNNING_MESSAGE;
  }
}
