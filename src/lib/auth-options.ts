// src/lib/auth-options.ts
import type { NextAuthOptions, Session, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Module augmentation to extend Session user type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
    }
  }
}

interface CredentialInput {
  email: string;
  password: string;
}

interface SessionUser {
  id: string;
  email: string;
  username: string;
  name: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        await dbConnect();

        const { email, password } = credentials as unknown as CredentialInput;

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        const user = await (User as any).findOne({ email });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username
        } satisfies NextAuthUser;
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 1 day
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser | undefined }) {
      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.username = (user as any).username ?? user.name ?? '';
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        username: token.username as string,
        name: token.username as string
      };
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
};
