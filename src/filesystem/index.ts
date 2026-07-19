// ── Filesystem module barrel exports ──

export { createFileSystemTree } from './tree';
export type { FileNode, NodeType } from './tree';
export { resolvePath, getNode, listDir, readFile, pathExists, isDirectory } from './utils';
