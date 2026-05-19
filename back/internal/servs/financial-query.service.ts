import type {
  FinancialIndicatorBriefDto,
  IndicatorValueResponseDto,
} from "../dtos/financial.dto.js";
import type { IFinancialIndicatorRepository } from "../repos/financial-indicator.interface.js";
import type { IIndicatorValueRepository } from "../repos/indicator-value.interface.js";
import { mapIndicatorRowToDto } from "../../pkgs/map-indicator-value.js";
import type { IFinancialQueryService } from "./financial-query.interface.js";

export class FinancialQueryService implements IFinancialQueryService {
  constructor(
    private readonly values: IIndicatorValueRepository,
    private readonly indicators: IFinancialIndicatorRepository,
  ) {}

  async listIndicatorValues(limit: number): Promise<IndicatorValueResponseDto[]> {
    const rows = await this.values.listWithRelations(limit);

    return rows.map(mapIndicatorRowToDto);
  }

  async listIndicators(): Promise<FinancialIndicatorBriefDto[]> {
    return this.indicators.listAll();
  }
}
