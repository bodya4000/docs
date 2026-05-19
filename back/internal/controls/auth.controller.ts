import express from 'express';

import { accessCookieName } from '../../pkgs/auth.middleware.js';
import { resolveJwtExpiresSec } from '../../pkgs/config.js';
import { appendSetCookie } from '../../pkgs/cookie-header.js';
import type { AuthService } from '../servs/auth.service.js';

function bodyString(record: Record<string, unknown>, key: string) {
  const v = record[key];
  return typeof v === 'string' ? v.trim() : '';
}

export function createAuthRouter(authService: AuthService) {
  const r = express.Router();
  const maxAge = resolveJwtExpiresSec();

  r.get('/auth/login', (_req, res) => {
    res.render('auth/login', {
      title: 'Вхід',
      error: null as string | null
    });
  });

  r.post('/auth/login', async (req, res, next) => {
    const wantsJson = req.is('application/json');
    let email = '';
    let password = '';
    if (wantsJson) {
      const b = req.body as Record<string, unknown>;
      email = typeof b.email === 'string' ? b.email.trim() : '';
      password = typeof b.password === 'string' ? b.password : '';
    } else {
      const b = req.body as Record<string, unknown>;
      email = bodyString(b, 'email');
      password = bodyString(b, 'password');
    }

    try {
      if (!(email && password)) {
        if (wantsJson) {
          return res.status(400).json({ error: 'email and password required' });
        }
        return res.status(400).render('auth/login', {
          title: 'Вхід',
          error: 'Вкажіть email і пароль.'
        });
      }

      const session = await authService.login(email, password);
      if (!session) {
        if (wantsJson) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }
        return res.status(401).render('auth/login', {
          title: 'Вхід',
          error: 'Невірний email або пароль.'
        });
      }

      if (wantsJson) {
        return res.status(200).json({ token: session.token, email: session.email });
      }

      const cookie = `${accessCookieName}=${encodeURIComponent(session.token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}`;
      appendSetCookie(res, cookie);
      return res.redirect(302, '/financial');
    } catch (err) {
      return next(err);
    }
  });

  return r;
}
