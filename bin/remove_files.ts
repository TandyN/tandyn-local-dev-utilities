#!/usr/bin/env node

import handler from '../src/remove_files';

const target = process.argv[2];

if (!target) {
  console.error('Usage: remove_files <path>');
  process.exit(1);
}

handler(target);
