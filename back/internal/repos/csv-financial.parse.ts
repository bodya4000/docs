import { parse } from 'csv-parse/sync';

import type { CsvFinancialRow } from '../models/csv-financial-row.js';

export function csvRecordToFinancialRow(rec: Record<string, string>): CsvFinancialRow {
  const year = Number.parseInt(rec.year ?? '', 10);
  const quarter = Number.parseInt(rec.quarter ?? '', 10);
  if (!Number.isFinite(year) || !Number.isFinite(quarter)) {
    throw new Error('Invalid CSV row: year or quarter is not numeric');
  }
  if (quarter < 1 || quarter > 4) {
    throw new Error('Invalid CSV row: quarter must be between 1 and 4');
  }
  const asOf = new Date(rec.as_of_date ?? '');
  if (Number.isNaN(asOf.getTime())) {
    throw new Error('Invalid CSV row: as_of_date is not a valid date');
  }
  return {
    year,
    quarter,
    indicatorCode: rec.indicator_code ?? '',
    indicatorName: rec.indicator_name ?? '',
    indicatorUnit: rec.indicator_unit ?? '',
    amount: rec.amount ?? '0',
    asOfDate: asOf
  };
}

export function parseFinancialCsvUtf8(utf8: string): CsvFinancialRow[] {
  const records = parse(utf8, {
    columns: true,
    trim: true,
    bom: true,
    skip_empty_lines: true
  }) as Record<string, string>[];
  return records.map((rec) => csvRecordToFinancialRow(rec));
}
