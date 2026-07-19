// ── tree command ──

import { registerCommand } from './registry';
import { resolvePath, getNode } from '../filesystem';
import type { FileNode } from '../filesystem';

export function registerTree(): void {
  registerCommand(
    'tree',
    (args, _flags, state, fs) => {
      const targetPath = args[0] || '.';
      const absPath = resolvePath(state.cwd, targetPath);
      const node = getNode(fs, absPath);

      if (!node) {
        return {
          output: `tree: '${targetPath}': No such file or directory`,
          exitCode: 2,
        };
      }

      if (node.type === 'file') {
        return { output: node.name, exitCode: 0 };
      }

      const rootName = node.name === '/' ? '/' : `${node.name}/`;
      const lines: string[] = [`\x1b[1;36m${rootName}\x1b[0m`];
      const counts = { dirs: 0, files: 0 };

      function traverse(n: FileNode, prefix: string): void {
        if (n.type !== 'dir' || !n.children) return;
        const childEntries = Object.values(n.children).filter(
          (c) => !c.name.startsWith('.')
        );
        childEntries.forEach((child, i) => {
          const isLast = i === childEntries.length - 1;
          const connector = isLast ? '└── ' : '├── ';
          const name =
            child.type === 'dir'
              ? `\x1b[1;36m${child.name}/\x1b[0m`
              : `\x1b[37m${child.name}\x1b[0m`;
          lines.push(`${prefix}${connector}${name}`);

          if (child.type === 'dir') {
            counts.dirs++;
            traverse(child, prefix + (isLast ? '    ' : '│   '));
          } else {
            counts.files++;
          }
        });
      }

      traverse(node, '');
      lines.push('');
      lines.push(
        `\x1b[2m${counts.dirs} director${counts.dirs === 1 ? 'y' : 'ies'}, ${counts.files} file${counts.files === 1 ? '' : 's'}\x1b[0m`
      );

      return { output: lines.join('\n'), exitCode: 0 };
    },
    'Show directory tree',
    {
      usage: 'tree [path]',
      manual: [
        'TREE(1)                  User Commands                  TREE(1)',
        '',
        'NAME',
        '       tree - list contents of directories in a tree-like format',
        '',
        'SYNOPSIS',
        '       tree [path]',
        '',
        'DESCRIPTION',
        '       Recursively list the contents of directories in a',
        '       tree-like format. Directories are shown in cyan,',
        '       files in white. Hidden files (starting with .) are',
        '       excluded by default.',
      ].join('\n'),
    },
  );
}
