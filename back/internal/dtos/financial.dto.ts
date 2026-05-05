export type ImportFromCsvRequestDto = {
  filePath: string;
};

export type ImportResultDto = {
  rowsRead: number;
  periodsEnsured: number;
  indicatorsEnsured: number;
  valuesUpserted: number;
};

export type IndicatorValueResponseDto = {
  id: string;
  amount: string;
  asOfDate: string;
  indicatorCode: string;
  indicatorName: string;
  indicatorUnit: string;
  year: number;
  quarter: number;
};

export type FinancialIndicatorBriefDto = {
  id: string;
  code: string;
  name: string;
  unit: string;
};

export type CreateIndicatorValueRequestDto = {
  indicatorId: string;
  year: number;
  quarter: number;
  amount: string;
  asOfDate: string;
};

export type UpdateIndicatorValueRequestDto = {
  amount: string;
  asOfDate: string;
};

export type ApiErrorDto = {
  error: string;
};
