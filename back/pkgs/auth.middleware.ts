import type express from 'express';

import { readCookieHeader } from './cookie-header.js';
import { verifyJwtEmail } from './jwt-email.js';

const accessCookieName = 'access_token';

function extractBearer(req: express.Request): string | undefined {
  const raw = req.headers.authorization;
  if (typeof raw !== 'string' || !raw.startsWith('Bearer ')) {
    return undefined;
  }
  const t = raw.slice('Bearer '.length).trim();
  return t.length > 0 ? t : undefined;
}

function extractToken(req: express.Request): string | undefined {
  return extractBearer(req) ?? readCookieHeader(req.headers.cookie, accessCookieName);
}

function isPublicRoute(path: string, method: string): boolean {
  if (path === '/openapi.json' && (method === 'GET' || method === 'HEAD')) {
    return true;
  }
  if (path === '/docs' || path.startsWith('/docs/')) {
    return true;
  }
  if (path === '/health' && method === 'GET') {
    return true;
  }
  if (path === '/auth/login' && (method === 'GET' || method === 'POST')) {
    return true;
  }
  return false;
}

function wantsJson(req: express.Request): boolean {
  return req.accepts(['json', 'html']) === 'json';
}

export function createJwtAuthMiddleware(secret: string): express.RequestHandler {
  return (req, res, next) => {
    if (isPublicRoute(req.path, req.method)) {
      return next();
    }
    const token = extractToken(req);
    if (!token) {
      if (wantsJson(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.redirect(302, '/auth/login');
    }
    try {
      const { email } = verifyJwtEmail(token, secret);
      req.authEmail = email;
      return next();
    } catch {
      if (wantsJson(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return res.redirect(302, '/auth/login');
    }
  };
}

export { accessCookieName };
