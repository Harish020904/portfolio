// ── cowsay easter egg ──

import { registerCommand } from './registry';

export function registerCowsay(): void {
  registerCommand(
    'cowsay',
    (args) => {
      const text = args.length > 0 ? args.join(' ') : 'Moo';
      const len = text.length;
      const top = ' ' + '_'.repeat(len + 2);
      const bottom = ' ' + '-'.repeat(len + 2);
      const bubble = `< ${text} >`;

      const cow = [
        top,
        bubble,
        bottom,
        '        \\   ^__^',
        '         \\  (oo)\\_______',
        '            (__)\\       )\\/\\',
        '                ||----w |',
        '                ||     ||',
      ].join('\n');

      return { output: cow, exitCode: 0 };
    },
    'Generate an ASCII picture of a cow saying something',
    {
      usage: 'cowsay [message]',
    },
  );
}
