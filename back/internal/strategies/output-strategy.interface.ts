import type { CsvFinancialRow } from '../models/csv-financial-row.js';

export interface OutputStrategy {
  send(row: CsvFinancialRow): Promise<void>;
}
