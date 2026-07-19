// ── ssh easter egg ──

import { registerCommand } from './registry';

export function registerSsh(): void {
  registerCommand(
    'ssh',
    () => ({
      output: 'ssh: connect to host prod port 22: Permission denied (publickey).\nBut you have excellent taste.',
      exitCode: 1,
    }),
    'OpenSSH remote login client',
    {
      usage: 'ssh [user@host]',
      manual: [
        'SSH(1)                   User Commands                   SSH(1)',
        '',
        'NAME',
        '       ssh - OpenSSH remote login client',
        '',
        'DESCRIPTION',
        '       Connects to a remote host. Or tries to, at least.',
      ].join('\n'),
    },
  );
}
