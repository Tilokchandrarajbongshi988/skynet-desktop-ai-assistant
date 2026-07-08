export type SkynetAction =
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
      folderName: FolderName;
      needsPermission: true;
    };

type AllowedAppName = 'chrome' | 'spotify' | 'notepad' | 'vscode' | 'calculator';
export type FolderName = 'downloads' | 'desktop' | 'documents';

const dangerousWords = [
  'delete',
  'remove',
  'erase',
  'format',
  'clear folder',
  'move files',
  'rename files',
];

export function detectAction(message: string): SkynetAction | null {
  const lower = message.toLowerCase();

  if (hasDangerousWord(lower)) {
    return null;
  }

  if (lower.includes('create note')) {
    const noteText = message.replace(/create note/i, '').trim();
    const [titlePart, ...contentParts] = noteText.split(':');
    const title = titlePart?.trim() || 'Untitled note';
    const content = contentParts.join(':').trim() || noteText || 'Created by Skynet.';

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

  const folderName = getRequestedFolder(lower);
  if (folderName) {
    return {
      type: 'OPEN_FOLDER',
      folderName,
      needsPermission: true,
    };
  }

  return null;
}

export function getBlockedActionMessage(message: string) {
  const lower = message.toLowerCase();

  if (hasDangerousWord(lower)) {
    return 'I cannot perform destructive file actions.';
  }

  if (lower.includes('open') && (lower.includes('c drive') || lower.includes('c:'))) {
    return 'I can only open Downloads, Desktop, and Documents for now.';
  }

  return null;
}

function hasDangerousWord(message: string) {
  return dangerousWords.some((word) => message.includes(word));
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

function getRequestedFolder(message: string): FolderName | null {
  if (
    message.includes('open downloads') ||
    message.includes('open download folder') ||
    message.includes('open downloads folder') ||
    message.includes('open my downloads')
  ) {
    return 'downloads';
  }

  if (
    message.includes('open desktop') ||
    message.includes('open desktop folder') ||
    message.includes('open my desktop')
  ) {
    return 'desktop';
  }

  if (
    message.includes('open documents') ||
    message.includes('open documents folder') ||
    message.includes('open my documents')
  ) {
    return 'documents';
  }

  return null;
}
