// ── whoami command ──

import { registerCommand } from './registry';

export function registerWhoami(): void {
  registerCommand(
    'whoami',
    () => ({
      output: 'harish',
      exitCode: 0,
    }),
    'Print the current user name',
    {
      usage: 'whoami',
      manual: [
        'WHOAMI(1)                User Commands                WHOAMI(1)',
        '',
        'NAME',
        '       whoami - print effective user name',
        '',
        'SYNOPSIS',
        '       whoami',
        '',
        'DESCRIPTION',
        '       Print the user name associated with the current',
        '       effective user ID.',
      ].join('\n'),
    },
  );
}
