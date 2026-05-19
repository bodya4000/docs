import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { appConfig } from "./config.js";

const backRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(backRoot, "..");
config({ path: resolve(repoRoot, ".env") });
config({ path: resolve(backRoot, ".env"), override: true });

let client: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!client) {
    const url = process.env.DATABASE_URL ?? appConfig.defaultDatabaseUrl;
    client = new PrismaClient({
      datasources: { db: { url } },
    });
  }
  return client;
}
