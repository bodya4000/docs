import type { PrismaClient } from "@prisma/client";
import type { IQuarterlyPeriodRepository } from "./quarterly-period.interface.js";

export class PrismaQuarterlyPeriodRepository implements IQuarterlyPeriodRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async ensureByYearQuarter(year: number, quarter: number): Promise<string> {
    const row = await this.prisma.quarterlyPeriod.upsert({
      where: { year_quarter: { year, quarter } },
      create: { year, quarter },
      update: {},
    });
    return row.id;
  }
}
