import { useState } from 'react';
import type { FormEvent } from 'react';

type ChatInputProps = {
  onSend: (message: string) => void;
};

function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    onSend(trimmedMessage);
    setMessage('');
  }

  return (
    <form
      className="flex gap-3 border-t border-slate-200 bg-white p-4"
      onSubmit={handleSubmit}
    >
      <input
        className="min-w-0 flex-1 rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        placeholder="Ask Luna anything..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
