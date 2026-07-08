import { useState } from 'react';
import type { FormEvent } from 'react';

export type SetupData = {
  userName: string;
  assistantName: string;
  theme: 'system' | 'light' | 'dark';
  responseStyle: 'balanced' | 'concise' | 'detailed';
};

type OnboardingProps = {
  onComplete: (data: SetupData) => Promise<void>;
};

function Onboarding({ onComplete }: OnboardingProps) {
  const [formData, setFormData] = useState<SetupData>({
    userName: '',
    assistantName: 'Skynet',
    theme: 'system',
    responseStyle: 'balanced',
  });
  const [isSaving, setIsSaving] = useState(false);

  function updateField<Key extends keyof SetupData>(key: Key, value: SetupData[Key]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onComplete({
        ...formData,
        userName: formData.userName.trim() || 'Friend',
        assistantName: formData.assistantName.trim() || 'Skynet',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="w-full max-w-3xl">
        <p className="inline-block border border-black bg-yellow-300 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-black">
          Welcome
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-black">
          Set up Skynet
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-700">
          Choose the basics for your local assistant. This is saved locally in SQLite.
        </p>

        <form className="mt-8 grid gap-5 rounded-md border border-black bg-white p-6" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-black">User name</span>
            <input
              className="rounded-md border border-black bg-white px-4 py-3 outline-none focus:bg-yellow-50"
              placeholder="Tilok"
              value={formData.userName}
              onChange={(event) => updateField('userName', event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-black">Assistant name</span>
            <input
              className="rounded-md border border-black bg-white px-4 py-3 outline-none focus:bg-yellow-50"
              value={formData.assistantName}
              onChange={(event) => updateField('assistantName', event.target.value)}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-black">Theme</span>
              <select
                className="rounded-md border border-black bg-white px-4 py-3 outline-none focus:bg-yellow-50"
                value={formData.theme}
                onChange={(event) => updateField('theme', event.target.value as SetupData['theme'])}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-black">Response style</span>
              <select
                className="rounded-md border border-black bg-white px-4 py-3 outline-none focus:bg-yellow-50"
                value={formData.responseStyle}
                onChange={(event) =>
                  updateField('responseStyle', event.target.value as SetupData['responseStyle'])
                }
              >
                <option value="balanced">Balanced</option>
                <option value="concise">Concise</option>
                <option value="detailed">Detailed</option>
              </select>
            </label>
          </div>

          <button
            className="mt-2 rounded-md border border-black bg-yellow-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-200 disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? 'Saving...' : 'Continue to Chat'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Onboarding;
