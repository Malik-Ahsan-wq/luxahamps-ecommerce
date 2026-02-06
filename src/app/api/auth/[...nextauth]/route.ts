import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare, hash } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { ObjectId } from "mongodb";

async function findUserByEmail(email: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection("users").findOne({ email });
}

async function ensureAdminSeed() {
  const client = await clientPromise;
  const db = client.db();
  const adminEmail = "admin@example.com";
  const existing = await db.collection("users").findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await hash("Admin123!", 10);
    await db.collection("users").insertOne({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
      createdAt: new Date(),
    });
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        await ensureAdminSeed();
        const user = await findUserByEmail(credentials.email);
        if (!user) {
          return null;
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }
        return {
          id: (user._id as ObjectId).toString(),
          name: user.name,
          email: user.email,
          role: user.role ?? "user",
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role ?? "user";
        (session.user as any).id = (token as any).sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
