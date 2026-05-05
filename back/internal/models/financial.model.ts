import type {
  CreateIndicatorValueRequestDto,
  UpdateIndicatorValueRequestDto,
} from "../dtos/financial.dto.js";
import type { IFinancialCommandService } from "../servs/financial-command.interface.js";
import type { IFinancialImportService } from "../servs/financial-import.interface.js";
import type { IFinancialQueryService } from "../servs/financial-query.interface.js";

export class FinancialModel {
  constructor(
    private readonly queryService: IFinancialQueryService,
    private readonly commandService: IFinancialCommandService,
    private readonly importService: IFinancialImportService,
  ) {}

  listIndicatorValues(limit: number) {
    return this.queryService.listIndicatorValues(limit);
  }

  listIndicators() {
    return this.queryService.listIndicators();
  }

  async findIndicatorValueById(id: string) {
    const rows = await this.queryService.listIndicatorValues(500);

    return rows.find((r) => r.id === id) ?? null;
  }

  createIndicatorValue(input: CreateIndicatorValueRequestDto) {
    return this.commandService.createIndicatorValue(input);
  }

  updateIndicatorValue(id: string, input: UpdateIndicatorValueRequestDto) {
    return this.commandService.updateIndicatorValue(id, input);
  }

  deleteIndicatorValue(id: string) {
    return this.commandService.deleteIndicatorValue(id);
  }

  importFromCsv(filePath: string) {
    return this.importService.importFromCsvPath(filePath);
  }

  importFromCsvUtf8(utf8: string) {
    return this.importService.importFromCsvUtf8(utf8);
  }
}
