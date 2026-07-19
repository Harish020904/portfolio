// ── clear command ──

import { registerCommand } from './registry';

export function registerClear(): void {
  registerCommand(
    'clear',
    () => ({
      output: '',
      exitCode: 99,  // Special: terminal clears on exitCode 99
    }),
    'Clear the terminal screen',
    {
      usage: 'clear',
      manual: [
        'CLEAR(1)                 User Commands                 CLEAR(1)',
        '',
        'NAME',
        '       clear - clear the terminal screen',
        '',
        'SYNOPSIS',
        '       clear',
        '',
        'DESCRIPTION',
        '       Clears the terminal screen. Equivalent to Ctrl+L.',
      ].join('\n'),
    },
  );
}
