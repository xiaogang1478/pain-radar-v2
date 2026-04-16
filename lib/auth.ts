import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'pain-radar-secret-key-change-in-production';

export interface TokenPayload {
  userId: number;
  email: string;
  memberType: string;
}

// 密码加密
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// 密码验证
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// 生成JWT
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// 验证JWT
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

// 获取当前用户ID（服务端）
export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  const payload = verifyToken(token);
  return payload?.userId || null;
}

// 获取当前用户信息（服务端）
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}
