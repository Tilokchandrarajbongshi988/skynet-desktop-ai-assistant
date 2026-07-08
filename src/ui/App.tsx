import { useEffect, useMemo, useState } from 'react';
import Sidebar, { type PageId } from './components/Sidebar';
import Onboarding, { type SetupData } from './pages/Onboarding';
import Chat from './pages/Chat';
import Memories from './pages/Memories';
import Notes from './pages/Notes';
import PrivacyDashboard from './pages/PrivacyDashboard';
import Settings from './pages/Settings';

function App() {
  const [setupData, setSetupData] = useState<LunaSettings | null>(null);
  const [activePage, setActivePage] = useState<PageId>('onboarding');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    window.luna.settings.getSettings().then((settings) => {
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
        <section className="grid min-h-screen place-items-center">
          <p className="text-sm text-slate-500">Starting Luna...</p>
        </section>
      );
    }

    if (!setupData?.setupCompleted || activePage === 'onboarding') {
      return (
        <Onboarding
          onComplete={async (data: SetupData) => {
            const settings = await window.luna.settings.saveSetup(data);
            setSetupData(settings);
            setActivePage('chat');
          }}
        />
      );
    }

    switch (activePage) {
      case 'memories':
        return <Memories />;
      case 'notes':
        return <Notes />;
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar
          activePage={activePage}
          setupComplete={Boolean(setupData?.setupCompleted)}
          onNavigate={setActivePage}
        />
        <main className="flex min-w-0 flex-1 flex-col bg-slate-100 text-slate-950">
          {currentPage}
        </main>
      </div>
    </div>
  );
}

export default App;
