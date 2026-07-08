import { useEffect, useMemo, useState } from 'react';
import Sidebar, { type PageId } from './components/Sidebar';
import Onboarding, { type SetupData } from './pages/Onboarding';
import Chat from './pages/Chat';
import PrivacyDashboard from './pages/PrivacyDashboard';
import Settings from './pages/Settings';

function App() {
  const [setupData, setSetupData] = useState<SkynetSettings | null>(null);
  const [activePage, setActivePage] = useState<PageId>('onboarding');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    window.skynet.settings.getSettings().then((settings) => {
      if (!isMounted) {
        return;
      }

      setSetupData(settings);
      setActivePage(settings.setupCompleted ? 'chat' : 'onboarding');
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentPage = useMemo(() => {
    if (isLoading) {
      return (
        <section className="grid min-h-screen place-items-center bg-white">
          <p className="border border-black bg-yellow-300 px-4 py-2 text-sm font-semibold text-black">
            Starting Skynet...
          </p>
        </section>
      );
    }

    if (!setupData?.setupCompleted || activePage === 'onboarding') {
      return (
        <Onboarding
          onComplete={async (data: SetupData) => {
            const settings = await window.skynet.settings.saveSetup(data);
            setSetupData(settings);
            setActivePage('chat');
          }}
        />
      );
    }

    switch (activePage) {
      case 'privacy':
        return <PrivacyDashboard />;
      case 'settings':
        return <Settings setupData={setupData} />;
      case 'chat':
      default:
        return <Chat assistantName={setupData.assistantName} />;
    }
  }, [activePage, isLoading, setupData]);

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex min-h-screen">
        <Sidebar
          activePage={activePage}
          setupComplete={Boolean(setupData?.setupCompleted)}
          onNavigate={setActivePage}
        />
        <main className="flex min-w-0 flex-1 flex-col bg-white text-black">
          {currentPage}
        </main>
      </div>
    </div>
  );
}

export default App;
