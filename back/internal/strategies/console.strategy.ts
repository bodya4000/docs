import type { CsvFinancialRow } from '../models/csv-financial-row.js';
import { csvFinancialRowToPlain } from './csv-financial-row-plain.js';
import type { OutputStrategy } from './output-strategy.interface.js';

export class ConsoleStrategy implements OutputStrategy {
  async send(row: CsvFinancialRow): Promise<void> {
    console.log(JSON.stringify(csvFinancialRowToPlain(row)));
  }
}
