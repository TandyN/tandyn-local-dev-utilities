import { spawn } from 'child_process';

export default function handleLinuxPorts(ports: string[]) {
  ports.forEach(port => {
    console.log(`\n🔍 Checking port ${port}...`);

    const check = spawn('sh', ['-c', `lsof -ti tcp:${port}`]);

    let pids = '';
    check.stdout.on('data', data => {
      pids += data.toString();
    });

    check.on('close', () => {
      const pidList = pids.split('\n').filter(Boolean);
      if (pidList.length === 0) {
        console.log(`⚠️ No processes found on port ${port}`);
        return;
      }

      console.log(`Found PIDs on port ${port}: ${pidList.join(', ')}`);
      const kill = spawn('kill', ['-9', ...pidList]);

      kill.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Successfully killed processes on port ${port}`);
        } else {
          console.error(`❌ Failed to kill processes on port ${port}`);
        }
      });
    });

    check.stderr?.on('data', data => {
      console.error(`❌ [Error checking port ${port}]:`, data.toString());
    });
  });
}
