import { SignJWT, jwtVerify } from 'jose';

export const secretToken = new TextEncoder().encode(process.env.TOKEN_KEY!);

export function generateToken(id: string, username: string) {
  return new SignJWT({ id, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(process.env.TOKEN_AGE || '3d')
    .sign(secretToken);
}

export async function verifyToken(token: string, secret: Uint8Array<ArrayBuffer>) {
  return await jwtVerify(token, secret);
}
