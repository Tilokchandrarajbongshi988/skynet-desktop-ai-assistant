export type ChatRole = 'user' | 'assistant';

type ChatMessageProps = {
  role: ChatRole;
  content: string;
};

function ChatMessage({ role, content }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div className={['flex', isAssistant ? 'justify-start' : 'justify-end'].join(' ')}>
      <div
        className={[
          'max-w-[70%] rounded-md border border-black px-4 py-3 text-sm leading-6',
          isAssistant
            ? 'bg-white text-black'
            : 'bg-yellow-300 text-black',
        ].join(' ')}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
          {isAssistant ? 'Skynet' : 'You'}
        </p>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
