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
      className="flex gap-3 border-t border-black bg-white p-4"
      onSubmit={handleSubmit}
    >
      <input
        className="min-w-0 flex-1 rounded-md border border-black bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-zinc-500 focus:bg-yellow-50"
        placeholder="Ask Skynet anything..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        className="rounded-md border border-black bg-yellow-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-200"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}

export default ChatInput;
