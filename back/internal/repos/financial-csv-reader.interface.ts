import type { CsvFinancialRow } from "../models/csv-financial-row.js";

export interface IFinancialCsvReaderRepository {
  readAllRows(absolutePath: string): Promise<CsvFinancialRow[]>;
  readAllRowsFromUtf8(utf8: string): Promise<CsvFinancialRow[]>;
}
