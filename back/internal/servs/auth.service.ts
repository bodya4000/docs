import { signJwtWithEmail } from '../../pkgs/jwt-email.js';
import type { IUserRepository } from '../repos/user.interface.js';

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export class AuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly jwtSecret: string,
    private readonly jwtExpiresSec: number
  ) {}

  async login(emailRaw: string, password: string): Promise<{ token: string; email: string } | null> {
    const email = normalizeEmail(emailRaw);
    if (!email || !password) {
      return null;
    }
    const row = await this.users.findByEmail(email);
    if (!row || row.password !== password) {
      return null;
    }
    const token = signJwtWithEmail(row.email, this.jwtSecret, this.jwtExpiresSec);
    return { token, email: row.email };
  }
}
