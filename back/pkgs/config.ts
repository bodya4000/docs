export const appConfig = {
  defaultPort: 4010,
  defaultDatabaseUrl: 'mysql://root@localhost:3306/unik_docs',
  defaultGeneratedCsvPath: 'data/financial-dataset.csv',
  defaultJwtSecret: 'dev-jwt-secret-change-me',
  defaultJwtExpiresSec: 86_400
} as const;

export function resolveHttpPort(): number {
  const raw = process.env.PORT ?? '';
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : appConfig.defaultPort;
}

export function resolveJwtSecret(): string {
  const s = process.env.JWT_SECRET?.trim();
  return s && s.length > 0 ? s : appConfig.defaultJwtSecret;
}

export function resolveJwtExpiresSec(): number {
  const raw = process.env.JWT_EXPIRES_SEC ?? '';
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : appConfig.defaultJwtExpiresSec;
}
