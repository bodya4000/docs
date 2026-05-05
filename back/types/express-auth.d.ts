declare module 'express-serve-static-core' {
  interface Request {
    authEmail?: string;
  }
}

export {};
