// ── Parser unit test script ──
// Run: npx tsx src/terminal/__tests__/parser.test.ts

import { parseCommand } from '../parser';

console.log('=== parseCommand ===');

const parserTests = [
  {
    input: 'ls -la /home/harish',
    expected: {
      command: 'ls',
      args: ['/home/harish'],
      flags: ['-l', '-a'],
      hasPipe: false,
      hasRedirect: false,
    },
  },
  {
    input: 'echo "hello world" --user harish',
    expected: {
      command: 'echo',
      args: ['hello world'],
      flags: ['--user'],
      namedFlags: { user: 'harish' },
      hasPipe: false,
    },
  },
  {
    input: 'cat src/index.ts | grep "export"',
    expected: {
      command: 'cat',
      args: ['src/index.ts'],
      hasPipe: true,
      pipeSegments: ['cat src/index.ts', 'grep "export"'],
    },
  },
  {
    input: 'echo "test" > output.txt',
    expected: {
      command: 'echo',
      args: ['test'],
      hasRedirect: true,
      redirectType: '>',
      redirectTarget: 'output.txt',
    },
  },
];

let pass = 0;
let fail = 0;

for (const test of parserTests) {
  const result = parseCommand(test.input);
  
  let passed = result.command === test.expected.command &&
    JSON.stringify(result.args) === JSON.stringify(test.expected.args) &&
    result.hasPipe === test.expected.hasPipe;

  if (test.expected.flags) {
    passed = passed && JSON.stringify(result.flags) === JSON.stringify(test.expected.flags);
  }
  
  if (test.expected.namedFlags) {
    passed = passed && JSON.stringify(result.namedFlags) === JSON.stringify(test.expected.namedFlags);
  }

  if (test.expected.hasRedirect) {
    passed = passed && result.hasRedirect === test.expected.hasRedirect &&
             result.redirectType === test.expected.redirectType &&
             result.redirectTarget === test.expected.redirectTarget;
  }
  
  if (passed) {
    console.log(`  ✅ parseCommand("${test.input}")`);
    pass++;
  } else {
    console.log(`  ❌ parseCommand("${test.input}")`);
    console.log(`     Got:`, result);
    console.log(`     Expected:`, test.expected);
    fail++;
  }
}

if (fail > 0) {
  throw new Error("Tests failed");
}
