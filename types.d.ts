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

type LunaMemory = {
  id: number;
  content: string;
  category: string | null;
  createdAt: string;
};

type LunaAction =
  | {
      type: 'CREATE_NOTE';
      needsPermission: true;
      payload: {
        title: string;
        content: string;
      };
    }
  | {
      type: 'OPEN_APP';
      needsPermission: true;
      payload: {
        appName: 'chrome' | 'spotify' | 'notepad' | 'vscode' | 'calculator';
      };
    }
  | {
      type: 'SEARCH_FILES';
      needsPermission: true;
      payload: {
        query: string;
      };
    };

type LunaChatResult = {
  messages: LunaChatMessage[];
  action?: LunaAction;
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
      }) => Promise<LunaChatResult>;
    };
    actions: {
      executeAction: (
        action: LunaAction,
        conversationId?: number,
      ) => Promise<{ message: string }>;
    };
    memory: {
      getMemories: () => Promise<LunaMemory[]>;
      createMemory: (content: string) => Promise<LunaMemory | null>;
      deleteMemory: (id: number) => Promise<boolean>;
      clearMemories: () => Promise<boolean>;
    };
    notes: {
      list: () => Promise<unknown[]>;
    };
    files: {
      summarizeTextFile: (fileContent: string) => Promise<{ summary: string }>;
    };
  };
}
