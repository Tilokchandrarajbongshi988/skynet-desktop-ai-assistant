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
          'max-w-[70%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm',
          isAssistant
            ? 'border border-slate-200 bg-white text-slate-800'
            : 'bg-slate-950 text-white',
        ].join(' ')}
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {isAssistant ? 'Luna' : 'You'}
        </p>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
