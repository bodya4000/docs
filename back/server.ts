import path from 'node:path';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { createAuthRouter } from './internal/controls/auth.controller.js';
import { createFinancialMvcRouter } from './internal/controls/financial.controller.js';
import { FinancialModel } from './internal/models/financial.model.js';
import { createJwtAuthMiddleware } from './pkgs/auth.middleware.js';
import { resolveHttpPort, resolveJwtSecret } from './pkgs/config.js';
import { createContainer } from './pkgs/container.js';
import { openApiDocument } from './pkgs/openapi-document.js';

const container = createContainer();

const financialModel = new FinancialModel(
  container.financialQueryService,
  container.financialCommandService,
  container.financialImportService
);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cwd = process.cwd();

app.set('views', path.join(cwd, 'views'));

app.set('view engine', 'ejs');

app.use(express.static(path.join(cwd, 'public')));

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ ok: true });
});

app.use(createAuthRouter(container.authService));

const jwtSecret = resolveJwtSecret();
app.use(createJwtAuthMiddleware(jwtSecret));

app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    swaggerOptions: { persistAuthorization: true }
  })
);
app.get('/openapi.json', (_req: express.Request, res: express.Response) => {
  res.json(openApiDocument);
});

app.use(createFinancialMvcRouter(financialModel));

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  const message = err instanceof Error ? err.message : 'Internal error';

  res.status(500).render('error', {
    title: 'Помилка',
    message
  });
});

const port = resolveHttpPort();

app.listen(port, () => {
  process.stdout.write(`listening ${port}\n`);
});
