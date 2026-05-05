import { resolve } from 'node:path';

import { createContainer } from '../pkgs/container.js';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    process.stderr.write('usage: import-from-csv <path-to.csv>\n');
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
