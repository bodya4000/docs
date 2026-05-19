import type { CsvFinancialRow } from '../models/csv-financial-row.js';

export function csvFinancialRowToPlain(row: CsvFinancialRow) {
  return {
    year: row.year,
    quarter: row.quarter,
    indicatorCode: row.indicatorCode,
    indicatorName: row.indicatorName,
    indicatorUnit: row.indicatorUnit,
    amount: row.amount,
    asOfDate: row.asOfDate.toISOString()
  };
}
