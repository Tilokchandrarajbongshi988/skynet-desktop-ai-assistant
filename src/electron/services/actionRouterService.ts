export type LunaAction =
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

type AllowedAppName = 'chrome' | 'spotify' | 'notepad' | 'vscode' | 'calculator';

export function detectAction(message: string): LunaAction | null {
  const lower = message.toLowerCase();

  if (lower.includes('create note')) {
    const noteText = message.replace(/create note/i, '').trim();
    const [titlePart, ...contentParts] = noteText.split(':');
    const title = titlePart?.trim() || 'Untitled note';
    const content = contentParts.join(':').trim() || noteText || 'Created by Luna.';

    return {
      type: 'CREATE_NOTE',
      needsPermission: true,
      payload: { title, content },
    };
  }

  const appName = getRequestedApp(lower);
  if (appName) {
    return {
      type: 'OPEN_APP',
      needsPermission: true,
      payload: { appName },
    };
  }

  if (lower.includes('find my resume')) {
    return {
      type: 'SEARCH_FILES',
      needsPermission: true,
      payload: { query: 'resume' },
    };
  }

  return null;
}

function getRequestedApp(message: string): AllowedAppName | null {
  if (message.includes('open chrome')) {
    return 'chrome';
  }

  if (message.includes('open spotify')) {
    return 'spotify';
  }

  if (message.includes('open notepad')) {
    return 'notepad';
  }

  if (message.includes('open vscode') || message.includes('open vs code')) {
    return 'vscode';
  }

  if (message.includes('open calculator')) {
    return 'calculator';
  }

  return null;
}
