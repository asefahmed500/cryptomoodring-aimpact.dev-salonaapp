// src/lib/auth.ts
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  username?: string;
  email?: string;
}

// Fixed: Return just the userId string instead of the full object
export async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return null;
    }

    // Return only the userId string, not the entire object
    const userId = token.id || token.sub;
    return userId as string;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

// If you need the full token payload, create a separate function
export async function getAuthTokenPayload(request: NextRequest): Promise<TokenPayload | null> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    return token ? {
      userId: token.id as string,
      username: token.username as string,
      email: token.email as string
    } : null;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function generateToken(payload: TokenPayload, expiresIn: SignOptions["expiresIn"] = '1d'): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const options: SignOptions = {
    expiresIn
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    options
  );
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}