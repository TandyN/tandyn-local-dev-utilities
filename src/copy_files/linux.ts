import fs from 'fs';
import path from 'path';
import { mkdir, stat, readdir, copyFile } from 'fs/promises';

function normalize(p: string): string {
  return path.resolve(p.replace(/\\/g, path.sep));
}

async function copyRecursive(src: string, dest: string): Promise<void> {
  const stats = await stat(src);
  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyRecursive(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  } else {
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(src, dest);
  }
}

export default async function copyFilesLinux(src: string, dest: string): Promise<void> {
  try {
    const from = normalize(src);
    const to = normalize(dest);
    await copyRecursive(from, to);
    console.log(`✅ Copied from "${from}" to "${to}" (Linux/macOS)`);
  } catch (err) {
    console.error(`❌ Copy failed: ${(err as Error).message}`);
  }
}
