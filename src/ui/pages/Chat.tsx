import { useEffect, useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';

type ChatProps = {
  assistantName: string;
};

function Chat({ assistantName }: ChatProps) {
  const [messages, setMessages] = useState<LunaChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    window.luna.chat.getMessages().then((storedMessages) => {
      if (!isMounted) {
        return;
      }

      setMessages(storedMessages);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSend(content: string) {
    const updatedMessages = await window.luna.chat.sendFakeMessage(content);
    setMessages(updatedMessages);
  }

  return (
    <section className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <p className="text-sm font-medium text-cyan-700">Chat</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Talk with {assistantName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Phase 2 saves messages in SQLite. Ollama will replace the fake response later.
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-8">
        {isLoading && <p className="text-sm text-slate-500">Loading messages...</p>}

        {!isLoading && messages.length === 0 && (
          <ChatMessage
            role="assistant"
            content="Hi, I am Luna. Send a message and I will save it locally."
          />
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </section>
  );
}

export default Chat;
