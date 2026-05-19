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

export function resolveKafkaBrokers(): string[] {
  const raw = process.env.KAFKA_BROKERS?.trim();
  const s = raw && raw.length > 0 ? raw : 'localhost:9092';
  return s.split(',').map((b) => b.trim()).filter(Boolean);
}

export function resolveKafkaTopic(): string {
  const raw = process.env.KAFKA_TOPIC?.trim();
  return raw && raw.length > 0 ? raw : 'financial-csv-rows';
}

export function resolveKafkaClientId(): string {
  const raw = process.env.KAFKA_CLIENT_ID?.trim();
  return raw && raw.length > 0 ? raw : 'unik-docs-csv-dispatch';
}

export function resolveRedisUrl(): string {
  const raw = process.env.REDIS_URL?.trim();
  return raw && raw.length > 0 ? raw : 'redis://127.0.0.1:6379';
}

export function resolveRedisListKey(): string {
  const raw = process.env.REDIS_CSV_LIST_KEY?.trim();
  return raw && raw.length > 0 ? raw : 'financial_csv_rows';
}
