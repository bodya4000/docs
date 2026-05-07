import { execFileSync } from 'node:child_process';
import { platform } from 'node:os';
import { resolve } from 'node:path';

import { createContainer } from '../pkgs/container.js';

function pickCsvPathInteractive(): string | null {
  if (platform() === 'darwin') {
    try {
      const out = execFileSync(
        'osascript',
        ['-e', 'POSIX path of (choose file with prompt "Оберіть CSV")'],
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      );

      const p = out.trim();

      return p || null;
    } catch {
      return null;
    }
  }

  if (platform() === 'win32') {
    try {
      const cmd =
        "Add-Type -AssemblyName System.Windows.Forms; $d=New-Object System.Windows.Forms.OpenFileDialog; $d.Filter='CSV (*.csv)|*.csv'; if($d.ShowDialog() -eq 'OK'){ $d.FileName }";
      const out = execFileSync('powershell.exe', ['-NoProfile', '-Command', cmd], {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore']
      });

      const p = out.trim().replace(/\r?\n/g, '');

      return p || null;
    } catch {
      return null;
    }
  }

  try {
    const out = execFileSync('zenity', ['--file-selection', '--file-filter=*.csv'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    });

    const p = out.trim();

    return p || null;
  } catch {
    return null;
  }
}

async function main() {
  let filePath = process.argv[2];
  if (!filePath) {
    filePath = pickCsvPathInteractive() ?? '';
  }
  if (!filePath) {
    process.stderr.write('usage: import-from-csv <path-to.csv>\n');
    process.stderr.write('(without arguments: native file dialog on macOS, Windows, or if zenity is installed)\n');
    process.exitCode = 1;
    return;
  }
  const { financialImportService } = createContainer();
  const absolute = resolve(filePath);
  const result = await financialImportService.importFromCsvPath(absolute);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : err}\n`);
  process.exitCode = 1;
});
