// ── ping easter egg ──

import { registerCommand } from './registry';

export function registerPing(): void {
  registerCommand(
    'ping',
    () => ({
      output: [
        'PING harish.dev (127.0.0.1): 56 data bytes',
        '64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.8 ms',
        '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.7 ms',
        '64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.9 ms',
        '64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.8 ms',
        '--- harish.dev ping statistics ---',
        '4 packets transmitted, 4 received, 0% packet loss, time 3ms',
      ].join('\n'),
      exitCode: 0,
    }),
    'Send ICMP ECHO_REQUEST to network hosts',
    {
      usage: 'ping [host]',
    },
  );
}
