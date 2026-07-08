export {};

declare global {
  interface Window {
    luna: {
      subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
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
}
