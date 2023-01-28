export const decorations = {
  1: 'bold',
  2: 'dim',
  3: 'italic',
  4: 'underline',
  7: 'reverse',
  9: 'strikethrough',
} as const;

export type DecorationType = typeof decorations[keyof typeof decorations];
