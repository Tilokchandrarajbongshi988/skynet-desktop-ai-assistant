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
    assistantName: 'Luna',
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
        assistantName: formData.assistantName.trim() || 'Luna',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Welcome
        </p>
        <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
          Set up Luna
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Choose the basics for your local assistant. This is saved locally in SQLite.
        </p>

        <form className="mt-8 grid gap-5 rounded-lg bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">User name</span>
            <input
              className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              placeholder="Tilok"
              value={formData.userName}
              onChange={(event) => updateField('userName', event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Assistant name</span>
            <input
              className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              value={formData.assistantName}
              onChange={(event) => updateField('assistantName', event.target.value)}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Theme</span>
              <select
                className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                value={formData.theme}
                onChange={(event) => updateField('theme', event.target.value as SetupData['theme'])}
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">Response style</span>
              <select
                className="rounded-md border border-slate-300 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
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
            className="mt-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
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
