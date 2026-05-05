import type { ImportResultDto } from "../dtos/financial.dto.js";

export interface IFinancialImportService {
  importFromCsvPath(filePath: string): Promise<ImportResultDto>;
}
