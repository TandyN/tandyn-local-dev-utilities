const platform = process.platform;

export default function removeFiles(target: string): void {
  if (platform === 'win32') {
    require('./windows').default(target);
  } else {
    require('./linux').default(target);
  }
}
