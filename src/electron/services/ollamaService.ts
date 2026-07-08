// Phase 2: call Ollama with qwen2.5:3b-instruct here.
export async function sendPromptToOllama(prompt: string) {
  return `Ollama is not connected yet. Received: ${prompt}`;
}
