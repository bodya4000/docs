import type { IndicatorValueResponseDto } from "../internal/dtos/financial.dto.js";
import type { IndicatorValueWithRelationsRow } from "../internal/repos/indicator-value.interface.js";

export function mapIndicatorRowToDto(
  r: IndicatorValueWithRelationsRow,
): IndicatorValueResponseDto {
  return {
    id: r.id,
    amount: r.amount,
    asOfDate: r.asOfDate.toISOString(),
    indicatorCode: r.indicator.code,
    indicatorName: r.indicator.name,
    indicatorUnit: r.indicator.unit,
    year: r.period.year,
    quarter: r.period.quarter,
  };
}
