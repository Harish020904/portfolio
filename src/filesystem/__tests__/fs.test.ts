// ── Filesystem unit test script ──
// Run: npx tsx src/filesystem/__tests__/fs.test.ts

import { createFileSystemTree } from '../tree';
import { resolvePath, getNode, listDir, readFile, pathExists, isDirectory } from '../utils';

const tree = createFileSystemTree();

// ── resolvePath tests ──
console.log('=== resolvePath ===');

const resolveTests: [string, string, string][] = [
  ['/home/harish', '.', '/home/harish'],
  ['/home/harish', '..', '/home'],
  ['/home/harish', '../..', '/'],
  ['/home/harish', '~', '/home/harish'],
  ['/home/harish', '~/projects', '/home/harish/projects'],
  ['/home/harish', 'projects', '/home/harish/projects'],
  ['/home/harish', '/home/harish/skills', '/home/harish/skills'],
  ['/home/harish/projects', '..', '/home/harish'],
  ['/home/harish/projects', '../contact', '/home/harish/contact'],
  ['/', 'home', '/home'],
  ['/home/harish', './about_me', '/home/harish/about_me'],
  ['/home/harish', './about_me/../projects', '/home/harish/projects'],
];

let pass = 0;
let fail = 0;

for (const [cwd, input, expected] of resolveTests) {
  const result = resolvePath(cwd, input);
  if (result === expected) {
    console.log(`  ✅ resolvePath("${cwd}", "${input}") = "${result}"`);
    pass++;
  } else {
    console.log(`  ❌ resolvePath("${cwd}", "${input}") = "${result}" (expected "${expected}")`);
    fail++;
  }
}

// ── getNode tests ──
console.log('\n=== getNode ===');

const nodeTests: [string, boolean][] = [
  ['/', true],
  ['/home', true],
  ['/home/harish', true],
  ['/home/harish/about_me', true],
  ['/home/harish/about_me/bio.txt', true],
  ['/home/harish/projects', true],
  ['/home/harish/projects/README.md', true],
  ['/home/harish/projects/homelab-setup.md', true],
  ['/home/harish/projects/k8s-cluster.md', true],
  ['/home/harish/homelabbing_experience', true],
  ['/home/harish/homelabbing_experience/journey.md', true],
  ['/home/harish/skills', true],
  ['/home/harish/skills/stack.md', true],
  ['/home/harish/tools_and_technologies', true],
  ['/home/harish/tools_and_technologies/tools.md', true],
  ['/home/harish/contact', true],
  ['/home/harish/contact/info.txt', true],
  ['/nonexistent', false],
  ['/home/harish/fake', false],
];

for (const [path, shouldExist] of nodeTests) {
  const node = getNode(tree, path);
  const exists = node !== null;
  if (exists === shouldExist) {
    console.log(`  ✅ getNode("${path}") ${exists ? `found "${node!.name}"` : 'null (correct)'}`);
    pass++;
  } else {
    console.log(`  ❌ getNode("${path}") ${exists ? `found "${node!.name}"` : 'null'} (expected ${shouldExist ? 'exists' : 'null'})`);
    fail++;
  }
}

// ── listDir tests ──
console.log('\n=== listDir ===');

const harishChildren = listDir(tree, '/home/harish');
const expectedDirs = ['about_me', 'projects', 'homelabbing_experience', 'skills', 'tools_and_technologies', 'contact'];
const childNames = harishChildren.map(c => c.name);

if (expectedDirs.every(d => childNames.includes(d)) && childNames.length === expectedDirs.length) {
  console.log(`  ✅ listDir("/home/harish") = [${childNames.join(', ')}]`);
  pass++;
} else {
  console.log(`  ❌ listDir("/home/harish") = [${childNames.join(', ')}] (expected [${expectedDirs.join(', ')}])`);
  fail++;
}

const projectFiles = listDir(tree, '/home/harish/projects');
const projNames = projectFiles.map(f => f.name);
if (projNames.includes('README.md') && projNames.includes('homelab-setup.md') && projNames.includes('k8s-cluster.md')) {
  console.log(`  ✅ listDir("/home/harish/projects") = [${projNames.join(', ')}]`);
  pass++;
} else {
  console.log(`  ❌ listDir("/home/harish/projects") = [${projNames.join(', ')}]`);
  fail++;
}

// listDir on a file should return empty
const fileListDir = listDir(tree, '/home/harish/about_me/bio.txt');
if (fileListDir.length === 0) {
  console.log('  ✅ listDir on a file returns []');
  pass++;
} else {
  console.log('  ❌ listDir on a file should return []');
  fail++;
}

// ── readFile tests ──
console.log('\n=== readFile ===');

const readTests: [string, string | null][] = [
  ['/home/harish/about_me/bio.txt', '// TODO REAL CONTENT'],
  ['/home/harish/projects/README.md', '// TODO REAL CONTENT'],
  ['/home/harish/skills/stack.md', '// TODO REAL CONTENT'],
  ['/home/harish/contact/info.txt', '// TODO REAL CONTENT'],
  ['/home/harish/projects', null],       // directory
  ['/home/harish/nonexistent', null],    // doesn't exist
];

for (const [path, expected] of readTests) {
  const result = readFile(tree, path);
  if (result === expected) {
    console.log(`  ✅ readFile("${path}") = ${result === null ? 'null' : `"${result}"`}`);
    pass++;
  } else {
    console.log(`  ❌ readFile("${path}") = ${result === null ? 'null' : `"${result}"`} (expected ${expected === null ? 'null' : `"${expected}"`})`);
    fail++;
  }
}

// ── pathExists tests ──
console.log('\n=== pathExists ===');

if (pathExists(tree, '/home/harish') && pathExists(tree, '/home/harish/about_me/bio.txt') && !pathExists(tree, '/fake')) {
  console.log('  ✅ pathExists works correctly');
  pass++;
} else {
  console.log('  ❌ pathExists failed');
  fail++;
}

// ── isDirectory tests ──
console.log('\n=== isDirectory ===');

if (isDirectory(tree, '/') && isDirectory(tree, '/home/harish') && isDirectory(tree, '/home/harish/projects') &&
    !isDirectory(tree, '/home/harish/about_me/bio.txt') && !isDirectory(tree, '/fake')) {
  console.log('  ✅ isDirectory works correctly');
  pass++;
} else {
  console.log('  ❌ isDirectory failed');
  fail++;
}

// ── Summary ──
console.log(`\n${'═'.repeat(40)}`);
console.log(`  Results: ${pass} passed, ${fail} failed`);
console.log(`${'═'.repeat(40)}`);

if (fail > 0) {
  throw new Error("Tests failed");
}
