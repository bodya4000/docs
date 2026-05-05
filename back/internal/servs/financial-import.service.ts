import { resolve } from 'node:path';

import type { ImportResultDto } from '../dtos/financial.dto.js';
import type { CsvFinancialRow } from '../models/csv-financial-row.js';
import type { IFinancialCsvReaderRepository } from '../repos/financial-csv-reader.interface.js';
import type { IFinancialIndicatorRepository } from '../repos/financial-indicator.interface.js';
import type { IIndicatorValueRepository } from '../repos/indicator-value.interface.js';
import type { IQuarterlyPeriodRepository } from '../repos/quarterly-period.interface.js';
import type { IFinancialImportService } from './financial-import.interface.js';

export class FinancialImportService implements IFinancialImportService {
  constructor(
    private readonly csvReader: IFinancialCsvReaderRepository,
    private readonly periods: IQuarterlyPeriodRepository,
    private readonly indicators: IFinancialIndicatorRepository,
    private readonly values: IIndicatorValueRepository
  ) {}

  async importFromCsvPath(filePath: string): Promise<ImportResultDto> {
    const absolutePath = resolve(filePath);
    const rows = await this.csvReader.readAllRows(absolutePath);
    return this.importRows(rows);
  }

  async importFromCsvUtf8(utf8: string): Promise<ImportResultDto> {
    const rows = await this.csvReader.readAllRowsFromUtf8(utf8);
    return this.importRows(rows);
  }

  private async importRows(rows: CsvFinancialRow[]): Promise<ImportResultDto> {
    const periodKeys = new Set<string>();
    const indicatorKeys = new Set<string>();
    let valuesUpserted = 0;
    for (const row of rows) {
      const code = row.indicatorCode.trim();
      if (!code) {
        throw new Error('Invalid CSV row: empty indicator_code');
      }
      const periodId = await this.periods.ensureByYearQuarter(row.year, row.quarter);
      periodKeys.add(periodId);
      const indicatorId = await this.indicators.ensureByCode(code, row.indicatorName, row.indicatorUnit);
      indicatorKeys.add(indicatorId);
      await this.values.upsertForPeriod(indicatorId, periodId, row.amount, row.asOfDate);
      valuesUpserted += 1;
    }
    return {
      rowsRead: rows.length,
      periodsEnsured: periodKeys.size,
      indicatorsEnsured: indicatorKeys.size,
      valuesUpserted
    };
  }
}
