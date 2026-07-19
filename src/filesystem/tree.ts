// ── Virtual Filesystem Tree ──
// Mimics a Linux inode tree with the exact portfolio directory structure.

export type NodeType = 'file' | 'dir';

export interface FileNode {
  name: string;
  type: NodeType;
  content?: string;                    // only for files
  children?: Record<string, FileNode>; // only for dirs
  permissions: string;                 // e.g. "drwxr-xr-x"
  modified: string;                    // e.g. "Jun 27 14:32"
  size?: number;                       // byte size (files)
}

/**
 * Build the complete virtual filesystem tree.
 *
 * Structure:
 * /
 * └── home/
 *     └── harish/
 *         ├── about_me/
 *         │   └── bio.txt
 *         ├── projects/
 *         │   ├── README.md
 *         │   ├── homelab-setup.md
 *         │   └── k8s-cluster.md
 *         ├── homelabbing_experience/
 *         │   └── journey.md
 *         ├── skills/
 *         │   └── stack.md
 *         ├── tools_and_technologies/
 *         │   └── tools.md
 *         └── contact/
 *             └── info.txt
 */
export function createFileSystemTree(): FileNode {
  return {
    name: '/',
    type: 'dir',
    permissions: 'drwxr-xr-x',
    modified: 'Jun 27 00:00',
    children: {
      home: {
        name: 'home',
        type: 'dir',
        permissions: 'drwxr-xr-x',
        modified: 'Jun 27 00:00',
        children: {
          harish: {
            name: 'harish',
            type: 'dir',
            permissions: 'drwxr-xr-x',
            modified: 'Jun 27 14:32',
            children: {
              about_me: {
                name: 'about_me',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                modified: 'Jun 27 14:32',
                children: {
                  'bio.txt': {
                    name: 'bio.txt',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 256,
                    content: '// TODO REAL CONTENT',
                  },
                },
              },
              projects: {
                name: 'projects',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                modified: 'Jun 27 14:32',
                children: {
                  'README.md': {
                    name: 'README.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 512,
                    content: '// TODO REAL CONTENT',
                  },
                  'homelab-setup.md': {
                    name: 'homelab-setup.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 1024,
                    content: '// TODO REAL CONTENT',
                  },
                  'k8s-cluster.md': {
                    name: 'k8s-cluster.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 896,
                    content: '// TODO REAL CONTENT',
                  },
                },
              },
              homelabbing_experience: {
                name: 'homelabbing_experience',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                modified: 'Jun 27 14:32',
                children: {
                  'journey.md': {
                    name: 'journey.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 768,
                    content: '// TODO REAL CONTENT',
                  },
                },
              },
              skills: {
                name: 'skills',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                modified: 'Jun 27 14:32',
                children: {
                  'stack.md': {
                    name: 'stack.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 640,
                    content: '// TODO REAL CONTENT',
                  },
                },
              },
              tools_and_technologies: {
                name: 'tools_and_technologies',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                modified: 'Jun 27 14:32',
                children: {
                  'tools.md': {
                    name: 'tools.md',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 480,
                    content: '// TODO REAL CONTENT',
                  },
                },
              },
              contact: {
                name: 'contact',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                modified: 'Jun 27 14:32',
                children: {
                  'info.txt': {
                    name: 'info.txt',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    modified: 'Jun 27 14:32',
                    size: 320,
                    content: '// TODO REAL CONTENT',
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}
