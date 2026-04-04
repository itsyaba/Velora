import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Db } from "mongodb";
import { connectDb } from "./db";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export async function getAuth(): Promise<ReturnType<typeof betterAuth>> {
  if (authInstance) return authInstance;
  const db = await connectDb();
  const instance = betterAuth({
    database: mongodbAdapter(db as unknown as Db),
    emailAndPassword: {
      enabled: true,
    },
    account: {},
    plugins: [admin(), nextCookies()],
    databaseHooks: {
      session: {
        create: {
          before: async (session) => {
            console.log("session create", session);
          },
        },
      },
      user: {
        update: {
          before: async (session) => {
            console.log("session update before", session, session);
          },
          after: async (session) => {
            console.log("session update after", session);
          },
        },
      },
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      twitter: {
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      },
    },
  });
  authInstance = instance as unknown as ReturnType<typeof betterAuth>;
  return authInstance;
}

type AuthInstance = Awaited<ReturnType<typeof getAuth>>;
export type UserSession = AuthInstance["$Infer"]["Session"];
export type User = UserSession["user"];
export type Session = UserSession["session"];
