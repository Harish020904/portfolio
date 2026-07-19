// ── Filesystem utility functions ──
// All path resolution and node lookup helpers for the virtual FS.

import type { FileNode } from './tree';

/**
 * Resolve a path string to an absolute path.
 * Handles `.`, `..`, `~`, absolute and relative paths.
 *
 * @param cwd  Current working directory (absolute path)
 * @param input  User-provided path string
 * @returns Normalized absolute path string
 */
export function resolvePath(cwd: string, input: string): string {
  if (!input || input === '.') return normalizePath(cwd);

  let absolutePath: string;

  if (input.startsWith('/')) {
    // Absolute path
    absolutePath = input;
  } else if (input === '~' || input.startsWith('~/')) {
    // Home shortcut
    absolutePath = input.replace(/^~/, '/home/harish');
  } else {
    // Relative path
    absolutePath = cwd === '/' ? `/${input}` : `${cwd}/${input}`;
  }

  return normalizePath(absolutePath);
}

/**
 * Normalize a path by resolving `.` and `..` segments and removing
 * duplicate/trailing slashes.
 */
function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  const resolved: string[] = [];

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }

  return '/' + resolved.join('/');
}

/**
 * Traverse the tree and return the FileNode at the given absolute path,
 * or `null` if the path doesn't exist.
 *
 * @param tree  Root FileNode of the virtual filesystem
 * @param path  Absolute path to look up (e.g. "/home/harish/projects")
 */
export function getNode(tree: FileNode, path: string): FileNode | null {
  const normalized = normalizePath(path);
  if (normalized === '/') return tree;

  const parts = normalized.split('/').filter(Boolean);
  let current: FileNode = tree;

  for (const part of parts) {
    if (current.type !== 'dir' || !current.children) {
      return null;
    }
    const child = current.children[part];
    if (!child) return null;
    current = child;
  }

  return current;
}

/**
 * List the children of a directory at the given absolute path.
 * Returns an empty array if the path doesn't exist or is a file.
 *
 * @param tree  Root FileNode
 * @param path  Absolute path to the directory
 */
export function listDir(tree: FileNode, path: string): FileNode[] {
  const node = getNode(tree, path);
  if (!node || node.type !== 'dir' || !node.children) {
    return [];
  }
  return Object.values(node.children);
}

/**
 * Read the content of a file at the given absolute path.
 * Returns `null` if the path doesn't exist, is a directory, or has no content.
 *
 * @param tree  Root FileNode
 * @param path  Absolute path to the file
 */
export function readFile(tree: FileNode, path: string): string | null {
  const node = getNode(tree, path);
  if (!node || node.type !== 'file') {
    return null;
  }
  return node.content ?? null;
}

/**
 * Check whether a path exists in the tree.
 *
 * @param tree  Root FileNode
 * @param path  Absolute path to check
 */
export function pathExists(tree: FileNode, path: string): boolean {
  return getNode(tree, path) !== null;
}

/**
 * Check whether the given path points to a directory.
 * Returns `false` if the path doesn't exist or is a file.
 *
 * @param tree  Root FileNode
 * @param path  Absolute path to check
 */
export function isDirectory(tree: FileNode, path: string): boolean {
  const node = getNode(tree, path);
  return node !== null && node.type === 'dir';
}
