import type { IndicatorValueResponseDto, FinancialIndicatorBriefDto } from "../dtos/financial.dto.js";

export interface IFinancialQueryService {
  listIndicatorValues(limit: number): Promise<IndicatorValueResponseDto[]>;
  listIndicators(): Promise<FinancialIndicatorBriefDto[]>;
}
