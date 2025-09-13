import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_KEY!);

export function generateAccessToken(id: string, username: string) {
  return new SignJWT({ id, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.ACCESS_TOKEN_AGE || '10m')
    .sign(secret);
}

export async function generateRefreshToken(id: string, username: string) {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_KEY!);

  return await new SignJWT({ id, username }).setProtectedHeader({ alg: 'HS256' }).sign(secret);
}

export async function verifyToken(token: string) {
  return await jwtVerify(token, secret);
}
