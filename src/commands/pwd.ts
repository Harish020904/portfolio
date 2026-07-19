// ── pwd command ──

import { registerCommand } from './registry';

export function registerPwd(): void {
  registerCommand(
    'pwd',
    (_args, _flags, state) => ({
      output: state.cwd,
      exitCode: 0,
    }),
    'Print the current working directory',
    {
      usage: 'pwd',
      manual: [
        'PWD(1)                   User Commands                   PWD(1)',
        '',
        'NAME',
        '       pwd - print name of current/working directory',
        '',
        'SYNOPSIS',
        '       pwd',
        '',
        'DESCRIPTION',
        '       Print the full filename of the current working directory.',
      ].join('\n'),
    },
  );
}
