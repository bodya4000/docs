export type IndicatorValueWithRelationsRow = {
  id: string;
  amount: string;
  asOfDate: Date;
  indicator: {
    code: string;
    name: string;
    unit: string;
  };
  period: {
    year: number;
    quarter: number;
  };
};

export interface IIndicatorValueRepository {
  upsertForPeriod(
    indicatorId: string,
    periodId: string,
    amount: string,
    asOfDate: Date,
  ): Promise<string>;
  updateById(id: string, amount: string, asOfDate: Date): Promise<void>;
  deleteById(id: string): Promise<void>;
  findWithRelationsById(id: string): Promise<IndicatorValueWithRelationsRow | null>;
  listWithRelations(limit: number): Promise<
    Array<IndicatorValueWithRelationsRow>
  >;
}
