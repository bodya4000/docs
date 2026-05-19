import { createClient, type RedisClientType } from 'redis';

import type { CsvFinancialRow } from '../models/csv-financial-row.js';
import { csvFinancialRowToPlain } from './csv-financial-row-plain.js';
import type { OutputStrategy } from './output-strategy.interface.js';

export class RedisStrategy implements OutputStrategy {
  private readonly client: RedisClientType;

  constructor(
    private readonly listKey: string,
    url: string
  ) {
    this.client = createClient({ url });
  }

  async send(row: CsvFinancialRow): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    const payload = JSON.stringify(csvFinancialRowToPlain(row));
    await this.client.rPush(this.listKey, payload);
  }
}
