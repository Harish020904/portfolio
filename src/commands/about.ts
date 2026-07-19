// ── about command ──

import { registerCommand } from './registry';

export function registerAbout(): void {
  registerCommand(
    'about',
    () => ({
      output: [
        '',
        "\x1b[1m\x1b[97mHi, I'm Harish Ragavender K\x1b[0m 👋",
        '',
        "\x1b[37mA developer who loves building things that live on the internet.\x1b[0m",
        "\x1b[37mPassionate about clean code, beautiful interfaces, and solving\x1b[0m",
        '\x1b[37mcomplex problems.\x1b[0m',
        '',
        "\x1b[38;5;245mWhen I'm not coding, you'll find me exploring new technologies,\x1b[0m",
        '\x1b[38;5;245mcontributing to open source, or tinkering with Linux systems.\x1b[0m',
        '',
        "\x1b[33mType 'ls' to explore my files, or 'help' for all commands.\x1b[0m",
        '',
      ].join('\n'),
      exitCode: 0,
    }),
    'Learn about Harish Ragavender K',
    {
      usage: 'about',
      manual: [
        'ABOUT(1)                 User Commands                 ABOUT(1)',
        '',
        'NAME',
        '       about - display information about the portfolio owner',
        '',
        'SYNOPSIS',
        '       about',
        '',
        'DESCRIPTION',
        '       Display a brief introduction about Harish Ragavender K.',
      ].join('\n'),
    },
  );
}
