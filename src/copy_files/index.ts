const platform = process.platform;

export default function copyFiles(src: string, dest: string): void {
  if (platform === 'win32') {
    require('./windows').default(src, dest);
  } else {
    require('./linux').default(src, dest);
  }
}
