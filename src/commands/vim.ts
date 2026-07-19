// ── vim easter egg ──
// Sets isVimMode: true and returns exitCode 101 so TerminalApp can handle it

import { registerCommand } from './registry';

export function registerVim(): void {
  registerCommand(
    'vim',
    (_args, _flags, state, _fs) => {
      state.setVimMode(true);
      return { output: '', exitCode: 101 };
    },
    'Open the legendary text editor',
    {
      usage: 'vim [file]',
      manual: [
        'VIM(1)                   User Commands                   VIM(1)',
        '',
        'NAME',
        '       vim - Vi IMproved, a text editor',
        '',
        'DESCRIPTION',
        '       Opens vim. Type :q to exit.',
        '       Good luck.',
      ].join('\n'),
    },
  );
}
