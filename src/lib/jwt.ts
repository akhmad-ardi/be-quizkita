import { SignJWT, jwtVerify } from 'jose';

export const secretAccessToken = new TextEncoder().encode(process.env.ACCESS_TOKEN_KEY!);
export const secretRefreshToken = new TextEncoder().encode(process.env.REFRESH_TOKEN_KEY!);

export function generateAccessToken(id: string, username: string) {
  return new SignJWT({ id, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.ACCESS_TOKEN_AGE || '10m')
    .sign(secretAccessToken);
}

export async function generateRefreshToken(id: string, username: string) {
  return await new SignJWT({ id, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.REFRESH_TOKEN_AGE || '7d')
    .sign(secretRefreshToken);
}

export async function verifyToken(token: string, secret: Uint8Array<ArrayBuffer>) {
  return await jwtVerify(token, secret);
}
