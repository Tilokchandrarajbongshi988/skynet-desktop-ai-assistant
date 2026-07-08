type Statistics = {
  cpuUsage: number;
  ramUsage: number;
  storageData: number;
};

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
};

type SetupData = {
  userName: string;
  assistantName: string;
  theme: 'system' | 'light' | 'dark';
  responseStyle: 'balanced' | 'concise' | 'detailed';
};

type LunaSettings = SetupData & {
  preferredLanguage: string;
  modelName: string;
  setupCompleted: boolean;
};

type LunaChatMessage = {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

interface Window {
  luna: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => void;
    getStaticData: () => Promise<StaticData>;
    settings: {
      getSettings: () => Promise<LunaSettings>;
      saveSetup: (data: SetupData) => Promise<LunaSettings>;
    };
    chat: {
      getMessages: () => Promise<LunaChatMessage[]>;
      sendMessage: (message: {
        conversationId?: number;
        content: string;
      }) => Promise<LunaChatMessage[]>;
    };
    memories: {
      list: () => Promise<unknown[]>;
    };
    notes: {
      list: () => Promise<unknown[]>;
    };
  };
}
