export {};

declare global {
  interface Window {
    skynet: {
      subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
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
}
