import { useEffect, useState } from 'react';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import FileUpload from '../components/FileUpload';
import PermissionModal from '../components/PermissionModal';

type ChatProps = {
  assistantName: string;
};

function Chat({ assistantName }: ChatProps) {
  const [messages, setMessages] = useState<LunaChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [pendingAction, setPendingAction] = useState<LunaAction | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileContent, setUploadedFileContent] = useState('');
  const [fileUploadError, setFileUploadError] = useState('');

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
    if (content.toLowerCase().includes('summarize this file')) {
      await handleSummarizeFile(content);
      return;
    }

    setIsSending(true);

    try {
      const conversationId = messages.at(-1)?.conversationId;
      const result = await window.luna.chat.sendMessage({ conversationId, content });
      setMessages(result.messages);
      setPendingAction(result.action ?? null);
    } finally {
      setIsSending(false);
    }
  }

  async function handleSummarizeFile(content: string) {
    const conversationId = messages.at(-1)?.conversationId ?? 0;
    const userMessage = createLocalMessage('user', content, conversationId);

    if (!uploadedFileContent) {
      const assistantMessage = createLocalMessage(
        'assistant',
        'Please upload a .txt file first, then ask me to summarize it.',
        conversationId,
      );
      setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
      return;
    }

    setIsSending(true);
    setMessages((currentMessages) => [...currentMessages, userMessage]);

    try {
      const result = await window.luna.files.summarizeTextFile(uploadedFileContent);
      const assistantMessage = createLocalMessage('assistant', result.summary, conversationId);
      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  }

  function handleFileLoaded(fileName: string, content: string) {
    setUploadedFileName(fileName);
    setUploadedFileContent(content);
    setFileUploadError('');
  }

  function handleClearFile() {
    setUploadedFileName('');
    setUploadedFileContent('');
    setFileUploadError('');
  }

  async function handleAllowAction() {
    if (!pendingAction) {
      return;
    }

    setIsSending(true);

    try {
      const conversationId = messages.at(-1)?.conversationId;
      await window.luna.actions.executeAction(pendingAction, conversationId);
      const updatedMessages = await window.luna.chat.getMessages();
      setMessages(updatedMessages);
      setPendingAction(null);
    } finally {
      setIsSending(false);
    }
  }

  async function handleCancelAction() {
    const conversationId = messages.at(-1)?.conversationId ?? 0;
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        conversationId,
        role: 'assistant',
        content: 'Action cancelled.',
        createdAt: new Date().toISOString(),
      },
    ]);
    setPendingAction(null);
  }

  return (
    <section className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <p className="text-sm font-medium text-cyan-700">Chat</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          Talk with {assistantName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Chat now uses local Ollama with qwen2.5:3b-instruct and saves messages in SQLite.
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

        {isSending && <p className="text-sm text-slate-500">Luna is thinking...</p>}
      </div>

      <FileUpload
        fileName={uploadedFileName}
        error={fileUploadError}
        onFileLoaded={handleFileLoaded}
        onClear={handleClearFile}
        onError={setFileUploadError}
      />

      <ChatInput onSend={handleSend} />

      {pendingAction && (
        <PermissionModal
          action={pendingAction}
          onAllow={handleAllowAction}
          onCancel={handleCancelAction}
        />
      )}
    </section>
  );
}

function createLocalMessage(
  role: 'user' | 'assistant',
  content: string,
  conversationId: number,
): LunaChatMessage {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    conversationId,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export default Chat;
