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

type SkynetSettings = SetupData & {
  preferredLanguage: string;
  modelName: string;
  setupCompleted: boolean;
};

type SkynetChatMessage = {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

type SkynetMemory = {
  id: number;
  content: string;
  category: string | null;
  createdAt: string;
};

type SkynetFolderName = 'downloads' | 'desktop' | 'documents';

type SkynetAction =
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
    }
  | {
      type: 'OPEN_FOLDER';
      folderName: SkynetFolderName;
      needsPermission: true;
    };

type SkynetChatResult = {
  mode: 'chat' | 'action_confirmation';
  assistantMessage: string;
  messages: SkynetChatMessage[];
  action?: SkynetAction;
};

interface Window {
  skynet: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void
    ) => void;
    getStaticData: () => Promise<StaticData>;
    settings: {
      getSettings: () => Promise<SkynetSettings>;
      saveSetup: (data: SetupData) => Promise<SkynetSettings>;
    };
    chat: {
      getMessages: () => Promise<SkynetChatMessage[]>;
      sendMessage: (message: {
        conversationId?: number;
        content: string;
      }) => Promise<SkynetChatResult>;
    };
    actions: {
      executeAction: (
        action: SkynetAction,
        conversationId?: number,
      ) => Promise<{ success: boolean; message: string }>;
    };
    memory: {
      getMemories: () => Promise<SkynetMemory[]>;
      createMemory: (content: string) => Promise<SkynetMemory | null>;
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
