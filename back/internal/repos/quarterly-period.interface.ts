export interface IQuarterlyPeriodRepository {
  ensureByYearQuarter(year: number, quarter: number): Promise<string>;
}
