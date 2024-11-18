import { error } from "console";
import prisma from "./db";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isExisting } from "./data-services";

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
        if (!(await isExisting(user.email || ""))) {
          await prisma.notifications.createMany({
            data: [
              {
                title: "Discover Email Summarization",
                description:
                  "Elevare automatically summarizes your emails so you can focus on what matters most. Check your dashboard to see how it works!",
                userEmailAddress: user.email || "",
                isRead: false,
              },
              {
                title: "Take Control of Your Data",
                description:
                  "Head to your profile page to explore options like exporting, revoking access, or deleting your data for full control.",
                userEmailAddress: user.email || "",
                isRead: false,
              },
              {
                title: "Understand Your Email Activity",
                description:
                  "Check out the Analytics section in your profile to see patterns, productivity stats, and actionable insights.",
                userEmailAddress: user.email || "",
                isRead: false,
              },
              {
                title: "Quick Replies for Effortless Communication",
                description:
                  "Use the Quick Reply section to send instant responses. Save time by letting Elevare craft smart, context-aware replies for you.",
                userEmailAddress: user.email || "",
                isRead: false,
              },
              {
                title: "Export Summarized Emails as PDFs",
                description:
                  "Easily download your summarized emails as PDFs from the profile section. Keep your key insights accessible anytime!",
                userEmailAddress: user.email || "",
                isRead: false,
              },
            ],
          });
        }
        const res = await prisma.users.upsert({
          where: { emailAddress: user.email || "" },
          update: {
            revokedAccess: false,
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
        console.log("res from user upsert", res);

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
