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
        sendFakeMessage: (message: string) => Promise<LunaChatMessage[]>;
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
