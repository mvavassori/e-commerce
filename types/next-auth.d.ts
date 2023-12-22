import NextAuth from "next-auth";
import { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  // Assuming Gender is a string enum you've defined somewhere in your project
  type Gender = "MALE" | "FEMALE" | "OTHER";

  // Extend the built-in User model of NextAuth to include the additional fields
  interface User
    extends Omit<
      PrismaUser,
      "id" | "createdAt" | "updatedAt" | "cart" | "orders" | "password"
    > {
    // Here you can specify the types of the extra fields if they differ from what Prisma expects
    birthDate: string; // Assuming you want to handle birthDate as string in NextAuth
    stripeCustomerId?: string | null;
  }

  // The Session object in NextAuth contains a user object with the same fields as the User model
  interface Session {
    user: User;
    // You can add more session-specific fields here if needed
  }

  // If you're also storing these fields in the JWT token, extend this type as well
  interface JWT {
    name?: string;
    surname?: string;
    email?: string;
    gender?: Gender;
    birthDate?: string;
    stripeCustomerId?: string | null;
  }
}
