import fs from 'fs/promises';
import path from 'path';
import process from 'process';

interface Args {
  searchText: string;
  replaceText: string;
  directory: string;
  ignoreDirs: string[];
  extensions: string[];
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const options: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('-')) {
      const key = args[i].replace(/^-+/, '');
      const value = args[i + 1];
      if (value && !value.startsWith('-')) {
        options[key] = value;
        i++;
      }
    }
  }

  if (!options.search_text || !options.replace_text) {
    console.error('Usage: replace_in_code -search_text "from" -replace_text "to" [optional flags]');
    process.exit(1);
  }

  const cwd = process.cwd(); // use current terminal directory

  return {
    searchText: options.search_text,
    replaceText: options.replace_text,
    directory: path.resolve(options.directory || cwd),
    ignoreDirs: (options.ignore_dirs || 'node_modules,.venv,.git,dist,build').split(',').map(d => d.trim()),
    extensions: (options.extensions || '.js,.ts,.py').split(',').map(e => e.trim()),
  };
}

function shouldIgnore(filePath: string, ignoreDirs: string[]): boolean {
  return ignoreDirs.some(dir =>
    filePath.includes(`${path.sep}${dir}${path.sep}`) ||
    filePath.startsWith(`${dir}${path.sep}`)
  );
}

async function findMatchingFiles(
  baseDir: string,
  ignoreDirs: string[],
  extensions: string[]
): Promise<string[]> {
  const result: string[] = [];

  async function walk(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!ignoreDirs.includes(entry.name)) {
          await walk(fullPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        result.push(fullPath);
      }
    }
  }

  await walk(baseDir);
  return result;
}

async function replaceInFile(filePath: string, searchText: string, replaceText: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    if (content.includes(searchText)) {
      const newContent = content.split(searchText).join(replaceText);
      await fs.writeFile(filePath, newContent, 'utf8');
      console.log(`🔄 Replaced in: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${filePath}: ${(err as Error).message}`);
  }
}

export async function main() {
  const args = parseArgs();

  console.log(`📂 Scanning directory: ${args.directory}`);
  console.log(`🚫 Ignoring directories: ${args.ignoreDirs.join(', ')}`);
  console.log(`📄 Including extensions: ${args.extensions.join(', ')}`);
  console.log(`🔍 Searching for: '${args.searchText}' → '${args.replaceText}'\n`);

  const allFiles = await findMatchingFiles(args.directory, args.ignoreDirs, args.extensions);

  if (allFiles.length === 0) {
    console.log('⚠️ No matching files found.');
    return;
  }

  console.log('✅ Matched Files:');
  allFiles.forEach(f => console.log(`  - ${f}`));

  console.log('\n🔧 Performing replacements...');
  for (const file of allFiles) {
    await replaceInFile(file, args.searchText, args.replaceText);
  }

  console.log('\n✅ Replacement complete.');
}
