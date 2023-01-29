export const namedColors = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'brightBlack',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightMagenta',
  'brightCyan',
  'brightWhite',
] as const;

export type ColorName = typeof namedColors[number];

export interface NamedColor {
  type: 'named';
  name: ColorName;
}

export interface TableColor {
  type: 'table';
  index: number;
}

export interface RgbColor {
  type: 'rgb';
  rgb: [number, number, number];
}

export type Color = NamedColor | TableColor | RgbColor;
