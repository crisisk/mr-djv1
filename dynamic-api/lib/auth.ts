import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Hardcoded admin user for now
// In production, this should be fetched from a database
const ADMIN_USER = {
  id: "1",
  username: "admin",
  password: "$2a$10$rYvCNKp5qJxK5KgJf5rGzOUYm3Z7KZzPnF1FJZnU3XZPHvq3QYvPa", // hashed: mrdj2025
  role: "admin",
  name: "Admin User",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Check if username matches
        if (credentials.username !== ADMIN_USER.username) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          ADMIN_USER.password
        );

        if (!isValid) {
          return null;
        }

        // Return user object
        return {
          id: ADMIN_USER.id,
          name: ADMIN_USER.name,
          email: `${ADMIN_USER.username}@mrdj.local`,
          role: ADMIN_USER.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token on sign in
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to session
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "mrdj-eds-secret-key-change-in-production",
};
