import jwt from 'jsonwebtoken';

export type JwtEmailClaims = {
  email: string;
};

export function signJwtWithEmail(email: string, secret: string, expiresInSec: number): string {
  return jwt.sign({ email }, secret, { expiresIn: expiresInSec });
}

export function verifyJwtEmail(token: string, secret: string): JwtEmailClaims {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded !== 'object' || decoded === null) {
    throw new Error('Invalid token');
  }
  const email = (decoded as Record<string, unknown>).email;
  if (typeof email !== 'string' || email.length === 0) {
    throw new Error('Invalid token');
  }
  return { email };
}
