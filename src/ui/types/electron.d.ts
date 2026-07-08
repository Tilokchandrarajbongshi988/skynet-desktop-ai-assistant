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
}
