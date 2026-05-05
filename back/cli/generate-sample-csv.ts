import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { appConfig } from '../pkgs/config.js';
import { CSV_MIN_ROW_REQUIREMENT, SAMPLE_INDICATOR_CODES } from '../pkgs/constants.js';

const names: Record<string, string> = {
  REV: 'Виторг',
  COGS: 'Собівартість',
  OPEX: 'Операційні витрати',
  EBIT: 'EBIT',
  NET: 'Чистий прибуток',
  CASH: 'Грошові кошти',
  AR: 'Дебіторська заборгованість',
  AP: 'Кредиторська заборгованість',
  CAPEX: 'Капітальні витрати',
  HEADCOUNT: 'Середньооблікова чисельність'
};

const units: Record<string, string> = {
  REV: 'UAH',
  COGS: 'UAH',
  OPEX: 'UAH',
  EBIT: 'UAH',
  NET: 'UAH',
  CASH: 'UAH',
  AR: 'UAH',
  AP: 'UAH',
  CAPEX: 'UAH',
  HEADCOUNT: 'осіб'
};

function quarterEndDate(year: number, quarter: number): string {
  const month = quarter * 3;
  const last = new Date(Date.UTC(year, month, 0));
  return last.toISOString().slice(0, 10);
}

function main() {
  const outArg = process.argv[2];
  const target = resolve(outArg ?? appConfig.defaultGeneratedCsvPath);
  const rowTarget = Math.max(CSV_MIN_ROW_REQUIREMENT + 200, 1200);
  mkdirSync(dirname(target), { recursive: true });
  const lines: string[] = ['year,quarter,indicator_code,indicator_name,indicator_unit,amount,as_of_date'];
  let year = 2022;
  let q = 1;
  for (let i = 0; i < rowTarget; i += 1) {
    const code = SAMPLE_INDICATOR_CODES[i % SAMPLE_INDICATOR_CODES.length];
    const base = 100000 + (i % 97) * 1379;
    const jitter = ((i * 7919) % 10000) - 5000;
    const amount = base + jitter;
    const iso = quarterEndDate(year, q);
    lines.push([year, q, code, names[code] ?? code, units[code] ?? 'UAH', amount.toString(), iso].join(','));
    q += 1;
    if (q > 4) {
      q = 1;
      year += 1;
    }
  }
  writeFileSync(target, `${lines.join('\n')}\n`, 'utf8');
  process.stdout.write(`wrote ${rowTarget} data rows to ${target}\n`);
}

main();
