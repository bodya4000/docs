import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'csv-parse';

import type { CsvFinancialRow } from '../models/csv-financial-row.js';
import { csvRecordToFinancialRow, parseFinancialCsvUtf8 } from './csv-financial.parse.js';
import type { IFinancialCsvReaderRepository } from './financial-csv-reader.interface.js';

export class FsFinancialCsvReaderRepository implements IFinancialCsvReaderRepository {
  async readAllRows(absolutePath: string): Promise<CsvFinancialRow[]> {
    const path = resolve(absolutePath);
    const stream = createReadStream(path, { encoding: 'utf8' });
    const parser = stream.pipe(
      parse({
        columns: true,
        trim: true,
        bom: true
      })
    );
    const rows: CsvFinancialRow[] = [];
    for await (const record of parser) {
      rows.push(csvRecordToFinancialRow(record as Record<string, string>));
    }
    return rows;
  }

  readAllRowsFromUtf8(utf8: string): Promise<CsvFinancialRow[]> {
    return Promise.resolve(parseFinancialCsvUtf8(utf8));
  }
}
