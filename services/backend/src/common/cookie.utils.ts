export interface CreateCookieOptions {
  name: string;
  value: string;
  isHttpOnly?: boolean;
  path?: string;
  maxAge?: string | number;
}

export function createCookie({
  name,
  value,
  isHttpOnly = true,
  path = '/',
  maxAge = '7d',
}: CreateCookieOptions): string {
  const httpOnlyString = isHttpOnly ? ' HttpOnly;' : '';
  return `${name}=${value};${httpOnlyString} Path=${path}; Max-Age=${maxAge}`;
}
