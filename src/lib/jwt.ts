import { SignJWT } from 'jose';

export function generateAccessToken(username: string) {
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_KEY!);

  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.ACCESS_TOKEN_AGE || '10m')
    .sign(secret);
}

export async function generateRefreshToken(username: string) {
  const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_KEY!);

  return await new SignJWT({ username }).setProtectedHeader({ alg: 'HS256' }).sign(secret);
}
