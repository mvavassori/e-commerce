import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/signin",
  },
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatches = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          name: existingUser.name,
          surname: existingUser.surname,
          gender: existingUser.gender,
          birthDate: existingUser.birthDate.toISOString(),
          stripeCustomerId: existingUser.stripeCustomerId || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("asyncjwt token", token);
      // console.log("asyncjwt user", user);
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          gender: user.gender,
          birthDate: user.birthDate,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("asyncsession session", session);
      // console.log("asyncsession token", token);
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          surname: token.surname,
          email: token.email,
          gender: token.gender,
          birthDate: token.birthDate,
        },
      };
    },
  },
};
