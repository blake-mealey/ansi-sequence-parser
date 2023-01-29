import { Color, namedColors } from './colors';
import { DecorationType, decorations } from './decorations';

export interface ParseToken {
  value: string;
  foreground: Color | null;
  background: Color | null;
  decorations: Set<DecorationType>;
}

function findSequence(value: string, position: number) {
  const nextEscape = value.indexOf('\u001b', position);

  if (nextEscape !== -1) {
    if (value[nextEscape + 1] === '[') {
      const nextClose = value.indexOf('m', nextEscape);
      return {
        sequence: value.substring(nextEscape + 2, nextClose).split(';'),
        startPosition: nextEscape,
        position: nextClose + 1,
      };
    }
  }
  return {
    position: value.length,
  };
}

type Command =
  | { type: 'setForegroundColor'; value: Color }
  | { type: 'resetForegroundColor' }
  | { type: 'setBackgroundColor'; value: Color }
  | { type: 'resetBackgroundColor' }
  | { type: 'setDecoration'; value: DecorationType }
  | { type: 'resetDecoration'; value: DecorationType }
  | { type: 'resetAll' };

function parseColor(sequence: string[]): Color | undefined {
  const colorMode = sequence.shift();
  if (colorMode === '2') {
    const rgb = sequence.splice(0, 3).map((x) => Number.parseInt(x));
    if (rgb.length !== 3 || rgb.some((x) => Number.isNaN(x))) return;
    return {
      type: 'rgb',
      rgb: rgb as [number, number, number],
    };
  } else if (colorMode === '5') {
    const index = sequence.shift();
    if (index) {
      return { type: 'table', index: Number(index) };
    }
  }
}

function parseSequence(sequence: string[]) {
  const commands: Command[] = [];

  while (sequence.length > 0) {
    const code = sequence.shift();
    if (!code) continue;

    const codeInt = Number.parseInt(code);
    if (Number.isNaN(codeInt)) continue;

    if (codeInt === 0) {
      commands.push({ type: 'resetAll' });
    } else if (codeInt <= 9) {
      const decoration = decorations[codeInt];
      if (decoration) {
        commands.push({
          type: 'setDecoration',
          value: decorations[codeInt],
        });
      }
    } else if (codeInt <= 29) {
      const decoration = decorations[codeInt - 20];
      if (decoration) {
        commands.push({
          type: 'resetDecoration',
          value: decoration,
        });
      }
    } else if (codeInt <= 37) {
      commands.push({
        type: 'setForegroundColor',
        value: { type: 'named', name: namedColors[codeInt - 30] },
      });
    } else if (codeInt === 38) {
      const color = parseColor(sequence);
      if (color) {
        commands.push({
          type: 'setForegroundColor',
          value: color,
        });
      }
    } else if (codeInt === 39) {
      commands.push({
        type: 'resetForegroundColor',
      });
    } else if (codeInt <= 47) {
      commands.push({
        type: 'setBackgroundColor',
        value: { type: 'named', name: namedColors[codeInt - 40] },
      });
    } else if (codeInt === 48) {
      const color = parseColor(sequence);
      if (color) {
        commands.push({
          type: 'setBackgroundColor',
          value: color,
        });
      }
    } else if (codeInt === 49) {
      commands.push({
        type: 'resetBackgroundColor',
      });
    } else if (codeInt >= 90 && codeInt <= 97) {
      commands.push({
        type: 'setForegroundColor',
        value: { type: 'named', name: namedColors[codeInt - 90 + 8] },
      });
    } else if (codeInt >= 100 && codeInt <= 107) {
      commands.push({
        type: 'setBackgroundColor',
        value: { type: 'named', name: namedColors[codeInt - 100 + 8] },
      });
    }
  }

  return commands;
}

export function createAnsiSequenceParser() {
  let foreground: Color | null = null;
  let background: Color | null = null;
  let decorations: Set<DecorationType> = new Set();

  return {
    parse(value: string) {
      const tokens: ParseToken[] = [];

      let position = 0;
      do {
        const findResult = findSequence(value, position);

        const text = findResult.sequence
          ? value.substring(position, findResult.startPosition)
          : value.substring(position);

        if (text.length > 0) {
          tokens.push({
            value: text,
            foreground,
            background,
            decorations: new Set(decorations),
          });
        }

        if (findResult.sequence) {
          const commands = parseSequence(findResult.sequence);

          // Process resets first
          for (const styleToken of commands) {
            if (styleToken.type === 'resetAll') {
              foreground = null;
              background = null;
              decorations.clear();
            } else if (styleToken.type === 'resetForegroundColor') {
              foreground = null;
            } else if (styleToken.type === 'resetBackgroundColor') {
              background = null;
            } else if (styleToken.type === 'resetDecoration') {
              decorations.delete(styleToken.value);
            }
          }

          // Process sets
          for (const styleToken of commands) {
            if (styleToken.type === 'setForegroundColor') {
              foreground = styleToken.value;
            } else if (styleToken.type === 'setBackgroundColor') {
              background = styleToken.value;
            } else if (styleToken.type === 'setDecoration') {
              decorations.add(styleToken.value);
            }
          }
        }

        position = findResult.position;
      } while (position < value.length);

      return tokens;
    },
  };
}

export function parseAnsiSequences(value: string) {
  return createAnsiSequenceParser().parse(value);
}
