// ── ls command ──

import { registerCommand } from './registry';
import { resolvePath, getNode, listDir } from '../filesystem';
import type { FileNode } from '../filesystem';

export function registerLs(): void {
  registerCommand(
    'ls',
    (args, flags, state, fs) => {
      const targetPath = args[0] || '.';
      const absPath = resolvePath(state.cwd, targetPath);
      const node = getNode(fs, absPath);

      if (!node) {
        return {
          output: `ls: cannot access '${targetPath}': No such file or directory`,
          exitCode: 2,
        };
      }

      if (node.type === 'file') {
        return { output: node.name, exitCode: 0 };
      }

      const children = listDir(fs, absPath);
      if (children.length === 0) {
        return { output: '', exitCode: 0 };
      }

      const showAll = flags.includes('-a') || flags.includes('--all');
      const showLong = flags.includes('-l');

      let items = children;
      if (!showAll) {
        items = items.filter((c) => !c.name.startsWith('.'));
      }

      if (items.length === 0) {
        return { output: '', exitCode: 0 };
      }

      if (showLong) {
        const lines = items.map((child) => formatLongEntry(child));
        // Add total line like real ls -l
        const total = items.reduce((sum, c) => sum + (c.size || 4096), 0);
        return {
          output: `total ${Math.ceil(total / 1024)}\n${lines.join('\n')}`,
          exitCode: 0,
        };
      }

      // Default: compact listing with colors
      const colored = items.map((child) =>
        child.type === 'dir'
          ? `\x1b[36m${child.name}/\x1b[0m`
          : `\x1b[37m${child.name}\x1b[0m`
      );

      return { output: colored.join('  '), exitCode: 0 };
    },
    'List directory contents',
    {
      usage: 'ls [-la] [path]',
      manual: [
        'LS(1)                    User Commands                    LS(1)',
        '',
        'NAME',
        '       ls - list directory contents',
        '',
        'SYNOPSIS',
        '       ls [-la] [path]',
        '',
        'DESCRIPTION',
        '       List information about files and directories.',
        '',
        '       -a, --all',
        '              do not ignore entries starting with .',
        '',
        '       -l     use a long listing format showing permissions,',
        '              owner, size, and modification date',
        '',
        'EXAMPLES',
        '       ls              List current directory',
        '       ls -la          List all files in long format',
        '       ls projects/    List contents of projects/',
      ].join('\n'),
    },
  );
}

function formatLongEntry(node: FileNode): string {
  const perms = node.permissions;
  const links = node.type === 'dir' ? '2' : '1';
  const owner = 'harish';
  const group = 'harish';
  const size = String(node.size || 4096).padStart(5);
  const date = node.modified;
  const name =
    node.type === 'dir'
      ? `\x1b[36m${node.name}/\x1b[0m`
      : `\x1b[37m${node.name}\x1b[0m`;

  return `${perms} ${links} ${owner} ${group} ${size} ${date} ${name}`;
}
