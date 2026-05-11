import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { Readable } from 'node:stream';
import csv from 'csv-parser';

import type { CsvFinancialRow } from '../models/csv-financial-row.js';
import { csvRecordToFinancialRow } from '../repos/csv-financial.parse.js';
import type { OutputStrategy } from '../strategies/output-strategy.interface.js';

async function dispatchRowsFromStream(
  stream: NodeJS.ReadableStream,
  strategy: OutputStrategy
): Promise<number> {
  let rowsSent = 0;
  const iterable = stream as AsyncIterable<Record<string, string>>;
  for await (const record of iterable) {
    const row: CsvFinancialRow = csvRecordToFinancialRow(record);
    await strategy.send(row);
    rowsSent += 1;
  }
  return rowsSent;
}

export class CsvRowDispatchContext {
  constructor(private readonly strategy: OutputStrategy) {}

  async dispatchFile(absolutePath: string): Promise<{ rowsSent: number }> {
    const path = resolve(absolutePath);
    const piped = createReadStream(path).pipe(csv());
    const rowsSent = await dispatchRowsFromStream(piped, this.strategy);
    return { rowsSent };
  }

  async dispatchUtf8(utf8: string): Promise<{ rowsSent: number }> {
    const piped = Readable.from(Buffer.from(utf8, 'utf8')).pipe(csv());
    const rowsSent = await dispatchRowsFromStream(piped, this.strategy);
    return { rowsSent };
  }
}
