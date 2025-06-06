import { spawn } from 'child_process';

export default function handleWindowsPorts(ports: string[]) {
  ports.forEach(port => {
    console.log(`\n🔍 Checking port ${port}...`);

    const ps = spawn('powershell.exe', [
      '-Command',
      `
      $conns = Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue;
      if ($conns) {
        Write-Output "Found connections on port ${port}";
        $pids = $conns | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique;
        foreach ($processId in $pids) {
          Write-Output "Killing PID $processId";
          Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue;
        }
        Write-Output "✅ Finished processing port ${port}";
      } else {
        Write-Output "⚠️ No processes found on port ${port}";
      }
      `
    ]);

    ps.stdout?.on('data', data => {
      process.stdout.write(data.toString());
    });

    ps.stderr?.on('data', data => {
      console.error(`❌ [Error on port ${port}]:`, data.toString());
    });
  });
}
