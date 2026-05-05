export const appConfig = {
  defaultPort: 4010,
  defaultDatabaseUrl: "mysql://root@localhost:3306/unik_docs",
  defaultGeneratedCsvPath: "data/financial-dataset.csv",
} as const;

export function resolveHttpPort(): number {
  const raw = process.env.PORT ?? "";
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : appConfig.defaultPort;
}
