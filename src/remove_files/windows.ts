import fs from 'fs/promises';
import path from 'path';

function normalize(p: string): string {
  return path.resolve(p.replace(/\//g, path.sep));
}

export default async function removeFilesWindows(target: string): Promise<void> {
  try {
    const fullPath = normalize(target);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
      console.log(`✅ Removed directory "${fullPath}" (Windows)`);
    } else {
      await fs.unlink(fullPath);
      console.log(`✅ Removed file "${fullPath}" (Windows)`);
    }
  } catch (err) {
    console.error(`❌ Remove failed: ${(err as Error).message}`);
  }
}
