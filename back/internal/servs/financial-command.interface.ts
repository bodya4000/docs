import type {
  CreateIndicatorValueRequestDto,
  IndicatorValueResponseDto,
  UpdateIndicatorValueRequestDto,
} from "../dtos/financial.dto.js";

export interface IFinancialCommandService {
  createIndicatorValue(
    input: CreateIndicatorValueRequestDto,
  ): Promise<IndicatorValueResponseDto>;
  updateIndicatorValue(
    id: string,
    input: UpdateIndicatorValueRequestDto,
  ): Promise<IndicatorValueResponseDto>;
  deleteIndicatorValue(id: string): Promise<void>;
}
