const crypto = require('node:crypto');

const sessionCookieName = 'restart_session';
const oauthStateCookieName = 'restart_oauth_state';
const oneDay = 24 * 60 * 60;

function randomId() {
  return crypto.randomUUID();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto.scryptSync(password, salt, 64).toString('base64url');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [algorithm, salt, expectedHash] = String(storedHash || '').split(':');
  if (algorithm !== 'scrypt' || !salt || !expectedHash) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, 'base64url');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('AUTH_SECRET must be set and at least 16 characters long.');
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac('sha256', getAuthSecret()).update(value).digest('base64url');
}

function createSessionToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + oneDay * 7
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

function readSessionToken(token) {
  if (!token || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return index === -1 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function secureCookieEnabled() {
  const secure = process.env.COOKIE_SECURE === '1' || (process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== '0');
  return secure;
}

function sameSiteCookieValue() {
  const value = String(process.env.COOKIE_SAMESITE || 'Lax').trim();
  return ['Strict', 'Lax', 'None'].includes(value) ? value : 'Lax';
}

function buildCookie(name, value, maxAge) {
  const secure = secureCookieEnabled();
  const sameSite = sameSiteCookieValue();
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=${sameSite}; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

function sessionCookie(token) {
  return buildCookie(sessionCookieName, token, oneDay * 7);
}

function clearSessionCookie() {
  return buildCookie(sessionCookieName, '', 0);
}

function oauthStateCookie(state) {
  return buildCookie(oauthStateCookieName, state, 10 * 60);
}

function clearOAuthStateCookie() {
  return buildCookie(oauthStateCookieName, '', 0);
}

module.exports = {
  clearOAuthStateCookie,
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  oauthStateCookie,
  oauthStateCookieName,
  parseCookies,
  randomId,
  readSessionToken,
  sessionCookie,
  sessionCookieName,
  verifyPassword
};
