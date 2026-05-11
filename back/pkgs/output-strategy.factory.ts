import { ConsoleStrategy } from '../internal/strategies/console.strategy.js';
import { KafkaStrategy } from '../internal/strategies/kafka.strategy.js';
import type { OutputStrategy } from '../internal/strategies/output-strategy.interface.js';
import { RedisStrategy } from '../internal/strategies/redis.strategy.js';
import { resolveKafkaBrokers, resolveKafkaClientId, resolveKafkaTopic, resolveRedisListKey, resolveRedisUrl } from './config.js';

export type OutputStrategyName = 'console' | 'kafka' | 'redis';

export function resolveOutputStrategyName(): OutputStrategyName {
  const raw = process.env.OUTPUT_STRATEGY?.trim().toLowerCase();
  if (!raw || raw === 'console') {
    return 'console';
  }
  if (raw === 'kafka') {
    return 'kafka';
  }
  if (raw === 'redis') {
    return 'redis';
  }
  throw new Error(`Unknown OUTPUT_STRATEGY "${process.env.OUTPUT_STRATEGY}". Use console, kafka, or redis.`);
}

export function createRowOutputStrategyFromEnv(): OutputStrategy {
  const name = resolveOutputStrategyName();
  if (name === 'console') {
    return new ConsoleStrategy();
  }
  if (name === 'kafka') {
    return new KafkaStrategy(resolveKafkaTopic(), resolveKafkaClientId(), resolveKafkaBrokers());
  }
  return new RedisStrategy(resolveRedisListKey(), resolveRedisUrl());
}
