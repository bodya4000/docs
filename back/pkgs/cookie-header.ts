export function readCookieHeader(reqCookies: string | undefined, name: string): string | undefined {
  if (!reqCookies) {
    return undefined;
  }
  for (const part of reqCookies.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) {
      continue;
    }
    const k = part.slice(0, i).trim();
    if (k !== name) {
      continue;
    }
    const v = part.slice(i + 1).trim();
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  }
  return undefined;
}

export function appendSetCookie(
  res: { getHeader: (n: string) => unknown; setHeader: (n: string, v: string | string[]) => void },
  cookie: string
) {
  const prev = res.getHeader('Set-Cookie');
  if (typeof prev === 'string') {
    res.setHeader('Set-Cookie', [prev, cookie]);
    return;
  }
  if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, cookie]);
    return;
  }
  res.setHeader('Set-Cookie', cookie);
}
