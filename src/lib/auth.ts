import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getUserByEmail } from "@/lib/user-repo";
import { sql } from "@vercel/postgres";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "E-mail e Senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password?.trim();
        if (!email || !password) return null;

        const user = await getUserByEmail(email);
        if (!user) return null;

        if (!user.emailVerified) {
          throw new Error("Conta não confirmada. Finalize o cadastro.");
        }

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image || null, 
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email!;
        token.name = user.name || null;
        if ((user as any).image) token.picture = (user as any).image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.email) {
        session.user = {
          ...(session.user || {}),
          email: token.email as string,
          name: (token.name as string) || undefined,
          image: (token.picture as string) || (session.user?.image as string | undefined) || null,
        } as any;
      }

      try {
        if (session?.user?.email) {
          const { rows } =
            await sql`select avatar_url from users where email = ${session.user.email}`;
          const dbAvatar = rows?.[0]?.avatar_url as string | null | undefined;
          if (dbAvatar) {
            session.user.image = dbAvatar; 
          }
        }
      } catch {
    }

      return session;
    },
  },
};
