import { mapIndicatorRowToDto } from "../../pkgs/map-indicator-value.js";
import type {
  CreateIndicatorValueRequestDto,
  IndicatorValueResponseDto,
  UpdateIndicatorValueRequestDto,
} from "../dtos/financial.dto.js";
import type { IIndicatorValueRepository } from "../repos/indicator-value.interface.js";
import type { IQuarterlyPeriodRepository } from "../repos/quarterly-period.interface.js";
import type { IFinancialCommandService } from "./financial-command.interface.js";

export class FinancialCommandService implements IFinancialCommandService {
  constructor(
    private readonly periods: IQuarterlyPeriodRepository,
    private readonly values: IIndicatorValueRepository,
  ) {}

  async createIndicatorValue(
    input: CreateIndicatorValueRequestDto,
  ): Promise<IndicatorValueResponseDto> {
    const periodId = await this.periods.ensureByYearQuarter(input.year, input.quarter);
    const id = await this.values.upsertForPeriod(
      input.indicatorId,
      periodId,
      input.amount,
      new Date(input.asOfDate),
    );
    const row = await this.values.findWithRelationsById(id);

    if (!row) {
      throw new Error("Failed to load created indicator value");
    }

    return mapIndicatorRowToDto(row);
  }

  async updateIndicatorValue(
    id: string,
    input: UpdateIndicatorValueRequestDto,
  ): Promise<IndicatorValueResponseDto> {
    await this.values.updateById(id, input.amount, new Date(input.asOfDate));
    const row = await this.values.findWithRelationsById(id);

    if (!row) {
      throw new Error("Indicator value not found");
    }

    return mapIndicatorRowToDto(row);
  }

  async deleteIndicatorValue(id: string): Promise<void> {
    await this.values.deleteById(id);
  }
}
