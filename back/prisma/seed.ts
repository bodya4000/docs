import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const prisma = new PrismaClient();

const testEmail = 'lab@test.local';
const testPassword = 'lab';

async function main() {
  await prisma.user.upsert({
    where: { email: testEmail },
    update: { password: testPassword },
    create: { email: testEmail, password: testPassword }
  });
  process.stdout.write(`seed user: ${testEmail} / ${testPassword}\n`);
}

main()
  .catch((e) => {
    process.stderr.write(`${e}\n`);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
