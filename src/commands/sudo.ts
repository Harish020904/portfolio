// ── sudo easter egg ──

import { registerCommand } from './registry';

export function registerSudo(): void {
  registerCommand(
    'sudo',
    () => ({
      output: 'bash: nice try. this is a portfolio, not your filesystem.\n(╯°□°）╯︵ ┻━┻',
      exitCode: 1,
    }),
    'Nice try',
    {
      usage: 'sudo [command]',
      manual: [
        'SUDO(1)                  User Commands                  SUDO(1)',
        '',
        'NAME',
        '       sudo - execute a command as another user',
        '',
        'DESCRIPTION',
        '       Not today, friend. This is a portfolio.',
      ].join('\n'),
    },
  );
}
