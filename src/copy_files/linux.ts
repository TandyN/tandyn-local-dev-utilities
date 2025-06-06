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
    const stats = await stat(from);
    let to = normalize(dest);

    if (stats.isDirectory()) {
      // Source is a directory: nest it into the destination
      to = path.join(to, path.basename(from));
    } else {
      // Source is a file
      try {
        const destStats = await stat(to);
        if (destStats.isDirectory()) {
          to = path.join(to, path.basename(from));
        }
      } catch {
        // Destination doesn't exist yet — that's fine
      }
    }

    await copyRecursive(from, to);
    console.log(`✅ Copied from "${from}" to "${to}" (Linux/macOS)`);
  } catch (err) {
    console.error(`❌ Copy failed: ${(err as Error).message}`);
  }
}
