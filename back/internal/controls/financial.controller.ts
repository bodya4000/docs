import express from "express";
import type { FinancialModel } from "../models/financial.model.js";
import type {
  CreateIndicatorValueRequestDto,
  UpdateIndicatorValueRequestDto,
} from "../dtos/financial.dto.js";

function bodyString(record: Record<string, unknown>, key: string) {
  const v = record[key];

  return typeof v === "string" ? v.trim() : "";
}

function toDatetimeLocalValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function createFinancialMvcRouter(model: FinancialModel) {
  const r = express.Router();

  const limit = () => 500;

  r.get("/", (_req, res) => {
    res.redirect(302, "/financial");
  });

  r.get("/financial", async (_req, res, next) => {
    try {
      const rows = await model.listIndicatorValues(limit());

      res.render("financial/list", {
        title: "Показники",
        rows,
      });
    } catch (err) {
      next(err);
    }
  });

  r.get("/financial/import", (_req, res) => {
    res.render("financial/import", {
      title: "Імпорт CSV",
      error: null as string | null,
      ok: false,
    });
  });

  r.post("/financial/import", async (req, res, next) => {
    const filePath = bodyString(req.body as Record<string, unknown>, "filePath");

    if (!filePath) {
      res.status(400).render("financial/import", {
        title: "Імпорт CSV",
        error: "Вкажіть шлях до файлу CSV.",
        ok: false,
      });

      return;
    }

    try {
      const result = await model.importFromCsv(filePath);

      res.render("financial/import", {
        title: "Імпорт CSV",
        error: null as string | null,
        ok: true,
        result,
      });
    } catch (err) {
      next(err);
    }
  });

  r.get("/financial/new", async (_req, res, next) => {
    try {
      const indicators = await model.listIndicators();

      res.render("financial/form-new", {
        title: "Новий запис",
        indicators,
        error: null as string | null,
      });
    } catch (err) {
      next(err);
    }
  });

  r.post("/financial/create", async (req, res, next) => {
    const b = req.body as Record<string, unknown>;
    const indicatorId = bodyString(b, "indicatorId");
    const amount = bodyString(b, "amount");
    const asOfDateRaw = bodyString(b, "asOfDate");
    const year = Number.parseInt(bodyString(b, "year"), 10);
    const quarter = Number.parseInt(bodyString(b, "quarter"), 10);

    try {
      const indicators = await model.listIndicators();

      if (!(indicatorId && amount && asOfDateRaw)) {
        res.status(400).render("financial/form-new", {
          title: "Новий запис",
          indicators,
          error: "Заповніть індикатор, суму та дату.",
        });

        return;
      }

      if (!(Number.isFinite(year) && Number.isFinite(quarter))) {
        res.status(400).render("financial/form-new", {
          title: "Новий запис",
          indicators,
          error: "Некоректний рік або квартал.",
        });

        return;
      }

      const asOfIso = new Date(asOfDateRaw).toISOString();

      const payload: CreateIndicatorValueRequestDto = {
        indicatorId,
        year,
        quarter,
        amount,
        asOfDate: asOfIso,
      };

      await model.createIndicatorValue(payload);
      res.redirect(302, "/financial");
    } catch (err) {
      next(err);
    }
  });

  r.get("/financial/:id/edit", async (req, res, next) => {
    const id =
      typeof req.params.id === "string" ? req.params.id.trim() : "";

    if (!id) {
      res.redirect(302, "/financial");

      return;
    }

    try {
      const row = await model.findIndicatorValueById(id);

      if (!row) {
        res.status(404).render("error", {
          title: "Не знайдено",
          message: "Запис не існує.",
        });

        return;
      }

      res.render("financial/form-edit", {
        title: "Редагування",
        row,
        asOfLocal: toDatetimeLocalValue(row.asOfDate),
        error: null as string | null,
      });
    } catch (err) {
      next(err);
    }
  });

  r.post("/financial/:id/update", async (req, res, next) => {
    const id =
      typeof req.params.id === "string" ? req.params.id.trim() : "";

    const b = req.body as Record<string, unknown>;
    const amount = bodyString(b, "amount");
    const asOfDateRaw = bodyString(b, "asOfDate");

    try {
      if (!id) {
        res.redirect(302, "/financial");

        return;
      }

      if (!(amount && asOfDateRaw)) {
        const row = await model.findIndicatorValueById(id);

        if (!row) {
          res.status(404).render("error", {
            title: "Не знайдено",
            message: "Запис не існує.",
          });

          return;
        }

        res.status(400).render("financial/form-edit", {
          title: "Редагування",
          row,
          asOfLocal: toDatetimeLocalValue(row.asOfDate),
          error: "Сума та дата обов’язкові.",
        });

        return;
      }

      const asOfIso = new Date(asOfDateRaw).toISOString();
      const payload: UpdateIndicatorValueRequestDto = { amount, asOfDate: asOfIso };

      await model.updateIndicatorValue(id, payload);
      res.redirect(302, "/financial");
    } catch (err) {
      next(err);
    }
  });

  r.post("/financial/:id/delete", async (req, res, next) => {
    const id =
      typeof req.params.id === "string" ? req.params.id.trim() : "";

    if (!id) {
      res.redirect(302, "/financial");

      return;
    }

    try {
      await model.deleteIndicatorValue(id);
      res.redirect(302, "/financial");
    } catch (err) {
      next(err);
    }
  });

  return r;
}
