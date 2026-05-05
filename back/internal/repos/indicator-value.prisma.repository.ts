import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { IIndicatorValueRepository } from "./indicator-value.interface.js";

export class PrismaIndicatorValueRepository implements IIndicatorValueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsertForPeriod(
    indicatorId: string,
    periodId: string,
    amount: string,
    asOfDate: Date,
  ): Promise<string> {
    const dec = new Prisma.Decimal(amount);

    const row = await this.prisma.indicatorValue.upsert({
      where: { indicatorId_periodId: { indicatorId, periodId } },
      create: { indicatorId, periodId, amount: dec, asOfDate },
      update: { amount: dec, asOfDate },
    });

    return row.id;
  }

  async updateById(id: string, amount: string, asOfDate: Date): Promise<void> {
    const dec = new Prisma.Decimal(amount);

    await this.prisma.indicatorValue.update({
      where: { id },
      data: { amount: dec, asOfDate },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.indicatorValue.delete({ where: { id } });
  }

  async findWithRelationsById(id: string) {
    const r = await this.prisma.indicatorValue.findUnique({
      where: { id },
      include: { indicator: true, period: true },
    });

    if (!r) {
      return null;
    }

    return {
      id: r.id,
      amount: r.amount.toString(),
      asOfDate: r.asOfDate,
      indicator: {
        code: r.indicator.code,
        name: r.indicator.name,
        unit: r.indicator.unit,
      },
      period: { year: r.period.year, quarter: r.period.quarter },
    };
  }

  async listWithRelations(limit: number) {
    const rows = await this.prisma.indicatorValue.findMany({
      take: limit,
      orderBy: { asOfDate: "desc" },
      include: { indicator: true, period: true },
    });
    return rows.map((r) => ({
      id: r.id,
      amount: r.amount.toString(),
      asOfDate: r.asOfDate,
      indicator: {
        code: r.indicator.code,
        name: r.indicator.name,
        unit: r.indicator.unit,
      },
      period: { year: r.period.year, quarter: r.period.quarter },
    }));
  }
}
