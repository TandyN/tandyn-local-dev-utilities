const platform = process.platform;

export default function handlePorts(ports: string[]) {
  if (platform === 'win32') {
    require('./windows').default(ports);
  } else {
    require('./linux').default(ports);
  }
}
