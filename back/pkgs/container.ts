import { FsFinancialCsvReaderRepository } from '../internal/repos/financial-csv.fs.repository.js';
import { PrismaFinancialIndicatorRepository } from '../internal/repos/financial-indicator.prisma.repository.js';
import { PrismaIndicatorValueRepository } from '../internal/repos/indicator-value.prisma.repository.js';
import { PrismaQuarterlyPeriodRepository } from '../internal/repos/quarterly-period.prisma.repository.js';
import { PrismaUserRepository } from '../internal/repos/user.prisma.repository.js';
import { AuthService } from '../internal/servs/auth.service.js';
import type { IFinancialCommandService } from '../internal/servs/financial-command.interface.js';
import { FinancialCommandService } from '../internal/servs/financial-command.service.js';
import { CsvRowDispatchContext } from '../internal/servs/csv-row-dispatch.context.js';
import type { IFinancialImportService } from '../internal/servs/financial-import.interface.js';
import { FinancialImportService } from '../internal/servs/financial-import.service.js';
import type { IFinancialQueryService } from '../internal/servs/financial-query.interface.js';
import { FinancialQueryService } from '../internal/servs/financial-query.service.js';
import { resolveJwtExpiresSec, resolveJwtSecret } from './config.js';
import { createRowOutputStrategyFromEnv } from './output-strategy.factory.js';
import { getPrisma } from './prisma.js';

export type AppContainer = {
  financialImportService: IFinancialImportService;
  financialQueryService: IFinancialQueryService;
  financialCommandService: IFinancialCommandService;
  csvRowDispatchContext: CsvRowDispatchContext;
  authService: AuthService;
};

export function createContainer(): AppContainer {
  const prisma = getPrisma();
  const csvReader = new FsFinancialCsvReaderRepository();
  const periods = new PrismaQuarterlyPeriodRepository(prisma);
  const indicators = new PrismaFinancialIndicatorRepository(prisma);
  const values = new PrismaIndicatorValueRepository(prisma);
  const financialImportService: IFinancialImportService = new FinancialImportService(
    csvReader,
    periods,
    indicators,
    values
  );
  const csvRowDispatchContext = new CsvRowDispatchContext(createRowOutputStrategyFromEnv());
  const financialQueryService: IFinancialQueryService = new FinancialQueryService(values, indicators);
  const financialCommandService: IFinancialCommandService = new FinancialCommandService(periods, values);
  const userRepo = new PrismaUserRepository(prisma);
  const authService = new AuthService(userRepo, resolveJwtSecret(), resolveJwtExpiresSec());
  return {
    financialImportService,
    financialQueryService,
    financialCommandService,
    csvRowDispatchContext,
    authService
  };
}
