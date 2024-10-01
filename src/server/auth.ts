import { PrismaAdapter } from "@auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      is_admin: boolean;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    is_admin: boolean;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        is_admin: user.is_admin,
      },
    }),
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    EmailProvider({
      normalizeIdentifier(identifier: string): string {
        const allowedDomains = ["computer-extra.de", "aem-gruppe.de"];
        // Get the first two elements only,
        // separated by `@` from user input.
        // eslint-disable-next-line prefer-const
        let [local, domain] = identifier.toLowerCase().trim().split("@");
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        if (identifier.split("@").length > 2) {
          throw new Error("Only one email allowed");
        }
        if (domain == null) {
          throw new Error("no domain");
        }
        if (!allowedDomains.includes(domain.toLowerCase())) {
          throw new Error("domain not allowed");
        }
        domain = domain.split(",")[0];
        return `${local}@${domain}`;
      },
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
