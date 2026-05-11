import { Kafka, type Producer } from 'kafkajs';

import type { CsvFinancialRow } from '../models/csv-financial-row.js';
import { csvFinancialRowToPlain } from './csv-financial-row-plain.js';
import type { OutputStrategy } from './output-strategy.interface.js';

const kafkaRetry = {
  initialRetryTime: 300,
  retries: 12,
  maxRetryTime: 30_000
} as const;

export class KafkaStrategy implements OutputStrategy {
  private readonly producer: Producer;

  private connected = false;

  constructor(
    private readonly topic: string,
    clientId: string,
    brokers: string[]
  ) {
    const kafka = new Kafka({
      clientId,
      brokers,
      connectionTimeout: 15_000,
      requestTimeout: 60_000,
      retry: { ...kafkaRetry }
    });
    this.producer = kafka.producer({
      retry: { ...kafkaRetry },
      metadataMaxAge: 300_000
    });
  }

  async send(row: CsvFinancialRow): Promise<void> {
    if (!this.connected) {
      await this.producer.connect();
      this.connected = true;
    }
    const value = JSON.stringify(csvFinancialRowToPlain(row));
    await this.producer.send({
      topic: this.topic,
      messages: [{ value }],
      acks: -1,
      timeout: 60_000
    });
  }
}
