#!/usr/bin/env node

import handler from '../src/get_and_kill_ports';

const input = process.argv[2];

if (!input) {
  console.error('Usage: get_and_kill_ports 123,456');
  process.exit(1);
}

const ports = input.split(',').map(p => p.trim()).filter(Boolean);
handler(ports);
