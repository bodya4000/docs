export type FinancialIndicatorRow = {
  id: string;
  code: string;
  name: string;
  unit: string;
};

export interface IFinancialIndicatorRepository {
  ensureByCode(code: string, name: string, unit: string): Promise<string>;
  listAll(): Promise<FinancialIndicatorRow[]>;
}
