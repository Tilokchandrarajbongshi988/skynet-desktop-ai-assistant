// Later phase: detect whether a message is chat, note creation, app launch, or file action.
export function detectAction(message: string) {
  return { type: 'chat', message };
}
