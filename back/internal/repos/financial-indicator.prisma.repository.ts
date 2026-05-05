import type { PrismaClient } from "@prisma/client";
import type { IFinancialIndicatorRepository } from "./financial-indicator.interface.js";

export class PrismaFinancialIndicatorRepository implements IFinancialIndicatorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async ensureByCode(code: string, name: string, unit: string): Promise<string> {
    const row = await this.prisma.financialIndicator.upsert({
      where: { code },
      create: { code, name, unit },
      update: { name, unit },
    });
    return row.id;
  }

  async listAll() {
    const rows = await this.prisma.financialIndicator.findMany({
      orderBy: { code: "asc" },
    });
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      name: r.name,
      unit: r.unit,
    }));
  }
}
