#!/usr/bin/env node

import handler from '../src/copy_files';

const [src, dest] = process.argv.slice(2);

if (!src || !dest) {
  console.error('Usage: copy_files <source> <destination>');
  process.exit(1);
}

handler(src, dest);
