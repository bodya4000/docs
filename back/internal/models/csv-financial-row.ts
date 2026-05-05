export type CsvFinancialRow = {
  year: number;
  quarter: number;
  indicatorCode: string;
  indicatorName: string;
  indicatorUnit: string;
  amount: string;
  asOfDate: Date;
};
