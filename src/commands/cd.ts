// ── cd command ──

import { registerCommand } from './registry';
import { resolvePath, getNode } from '../filesystem';

export function registerCd(): void {
  registerCommand(
    'cd',
    (args, _flags, state, fs) => {
      const target = args[0] || '~';
      const absPath = resolvePath(state.cwd, target);
      const node = getNode(fs, absPath);

      if (!node) {
        return {
          output: `cd: ${target}: No such file or directory`,
          exitCode: 1,
        };
      }

      if (node.type !== 'dir') {
        return {
          output: `cd: ${target}: Not a directory`,
          exitCode: 1,
        };
      }

      return { output: '', exitCode: 0, newCwd: absPath };
    },
    'Change the working directory',
    {
      usage: 'cd [path]',
      manual: [
        'CD(1)                    User Commands                    CD(1)',
        '',
        'NAME',
        '       cd - change the working directory',
        '',
        'SYNOPSIS',
        '       cd [path]',
        '',
        'DESCRIPTION',
        '       Change the current working directory to the given path.',
        '       If no path is given, changes to the home directory (~).',
        '',
        '       Supports:',
        '         ~       Home directory (/home/harish)',
        '         ..      Parent directory',
        '         .       Current directory',
        '         /path   Absolute paths',
        '         path    Relative paths',
        '',
        'EXAMPLES',
        '       cd              Go to home directory',
        '       cd projects     Go to projects/',
        '       cd ..           Go up one level',
        '       cd ~/skills     Go to ~/skills',
      ].join('\n'),
    },
  );
}
