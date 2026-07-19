// ── echo command ──

import { registerCommand } from './registry';

export function registerEcho(): void {
  registerCommand(
    'echo',
    (args, _flags, state) => {
      // Join all args, then perform variable substitution
      let text = args.join(' ');

      // Support common shell variables
      text = text.replace(/\$HOME/g, '/home/harish');
      text = text.replace(/\$USER/g, 'harish');
      text = text.replace(/\$SHELL/g, '/bin/bash');
      text = text.replace(/\$PWD/g, state.cwd);
      text = text.replace(/\$HOSTNAME/g, 'archlinux');
      text = text.replace(/\$TERM/g, 'xterm-256color');

      return { output: text, exitCode: 0 };
    },
    'Print text to the terminal',
    {
      usage: 'echo [text...]',
      manual: [
        'ECHO(1)                  User Commands                  ECHO(1)',
        '',
        'NAME',
        '       echo - display a line of text',
        '',
        'SYNOPSIS',
        '       echo [text...]',
        '',
        'DESCRIPTION',
        '       Echo the STRING(s) to standard output.',
        '',
        '       Supports variable substitution:',
        '         $HOME      Home directory path',
        '         $USER      Current username',
        '         $SHELL     Current shell',
        '         $PWD       Current working directory',
        '         $HOSTNAME  System hostname',
        '',
        'EXAMPLES',
        '       echo Hello World',
        '       echo "My home is $HOME"',
        '       echo $USER@$HOSTNAME',
      ].join('\n'),
    },
  );
}
