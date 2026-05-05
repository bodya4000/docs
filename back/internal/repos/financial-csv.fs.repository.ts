import { parse } from "csv-parse";
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import type { CsvFinancialRow } from "../models/csv-financial-row.js";
import type { IFinancialCsvReaderRepository } from "./financial-csv-reader.interface.js";

export class FsFinancialCsvReaderRepository implements IFinancialCsvReaderRepository {
  async readAllRows(absolutePath: string): Promise<CsvFinancialRow[]> {
    const path = resolve(absolutePath);
    const stream = createReadStream(path, { encoding: "utf8" });
    const parser = stream.pipe(
      parse({
        columns: true,
        trim: true,
        bom: true,
      }),
    );
    const rows: CsvFinancialRow[] = [];
    for await (const record of parser) {
      const rec = record as Record<string, string>;
      const year = Number.parseInt(rec.year ?? "", 10);
      const quarter = Number.parseInt(rec.quarter ?? "", 10);
      if (!Number.isFinite(year) || !Number.isFinite(quarter)) {
        throw new Error("Invalid CSV row: year or quarter is not numeric");
      }
      if (quarter < 1 || quarter > 4) {
        throw new Error("Invalid CSV row: quarter must be between 1 and 4");
      }
      const asOf = new Date(rec.as_of_date ?? "");
      if (Number.isNaN(asOf.getTime())) {
        throw new Error("Invalid CSV row: as_of_date is not a valid date");
      }
      rows.push({
        year,
        quarter,
        indicatorCode: rec.indicator_code ?? "",
        indicatorName: rec.indicator_name ?? "",
        indicatorUnit: rec.indicator_unit ?? "",
        amount: rec.amount ?? "0",
        asOfDate: asOf,
      });
    }
    return rows;
  }
}
