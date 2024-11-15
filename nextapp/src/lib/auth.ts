import { error } from "console";
import prisma from "./db";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/gmail.modify",
          ].join(" "),
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },

    async signIn({ user, account, profile }) {
      if (!account?.refresh_token) {
        return true; // Still allow sign in even without refresh token
      }

      try {
        await prisma.users.upsert({
          where: { emailAddress: user.email || "" },
          update: {
            refreshToken: account.refresh_token,
          },
          create: {
            id: user.id || "",
            userName: user.name || "",
            emailAddress: user.email || "",
            profileUrl: user.image || "",

            refreshToken: account.refresh_token,
            emailsCnt: 0,
            categories: [
              "Security",
              "Personal",

              "Finance",
              "Marketing",
              "Education",
              "Customer Service",
            ],
            lastFetchdTimeStamp: null,
            joinedDate: new Date(),
          },
        });
        return true;
      } catch (error) {
        console.error("Error during user upsert:", error);
        return false;
      }
    },
  },
  pages: {
    error: "/error",
  },
  trustHost: true,
});
