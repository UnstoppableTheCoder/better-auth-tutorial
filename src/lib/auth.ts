import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { sendEmail } from "./email";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { passwordSchema } from "./validation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    // minPasswordLength: 8,
    enabled: true,
    // autoSignIn: false, // after sign up, user will be signed in - By default it's true
    // requireEmailVerification: true, // this lets the user sign in only when the email is verified
    async sendResetPassword({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  // Configuring it to send emails to the user after SignUp & whenever it's called
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  // if updateEmailWithoutVerification: false (by default) & Using -> sendChangeEmailConfirmation ->
  //  1. when you change your email & your email is not verified,
  //  2. You'll will not get approval email on your current gmail & the new email will get a verify-email link directly
  //  3. If you're email is verified -> You'll get approval email in your current gmail & then verify email will be sent to the new email after approval
  //  4. Only after verifying the new email, you will see the changes

  // Never do this ->
  // if updateEmailWithoutVerification: true & Using -> sendChangeEmailConfirmation ->
  //  1. when you change your email & your email is not verified,
  //  2. You'll will not get approve email on your current gmail & the new email will get a verify-email link directly
  //  3. If you're email is verified -> You'll get approve email in your current gmail & then verify email will be sent to the new email after approval
  //  4. Only after verifying the new email, you will see the changes
  // => With sendChangeEmailVerification -> updateEmailWithoutVerification doesn't have any effect.
  // => Never use this like this -> use updateEmailWithoutVerification alone

  // if updateEmailWithoutVerification: true
  // Email Verified
  // 1. Verify email will be sent to the new email
  // 2. After verifying the new email, you'll see the changes
  // Email Unverified
  // 1. You'll directly be able to change the email
  user: {
    changeEmail: {
      enabled: true,
      // updateEmailWithoutVerification: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Approve email change",
          text: `Your email has been changed to ${newEmail}. Click the link to approve the change: ${url}`,
        });
      },
    },
    additionalFields: {
      role: {
        type: "string",
        input: false, // User cannot change the role
      },
    },
  },
  hooks: {
    // This will run before anything else does
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === "/sign-up/email" ||
        ctx.path === "/reset-password" ||
        ctx.path === "/change-password"
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        const { error } = passwordSchema.safeParse(password);

        if (error) {
          throw new APIError("BAD_REQUEST", {
            message: "Password not strong enough",
          });
        }
      }
    }),
  },
});

// Inferring & Exporting our own custom Session & User types because I added extra role field in model user in schema.prisma
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
