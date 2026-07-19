// ── date command ──

import { registerCommand } from './registry';

export function registerDate(): void {
  registerCommand(
    'date',
    () => ({
      output: new Date().toString(),
      exitCode: 0,
    }),
    'Show current date and time',
    {
      usage: 'date',
      manual: [
        'DATE(1)                  User Commands                  DATE(1)',
        '',
        'NAME',
        '       date - print the system date and time',
        '',
        'SYNOPSIS',
        '       date',
        '',
        'DESCRIPTION',
        '       Display the current date and time.',
      ].join('\n'),
    },
  );
}
