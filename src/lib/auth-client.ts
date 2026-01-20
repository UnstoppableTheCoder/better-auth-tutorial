import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: "http://localhost:3000",
  baseURL: "https://better-auth-tutorial-eb9k.vercel.app",
  // nextCookies() - mainly needed when working with server actions - Know more about it
  // inferAdditionalFields() -> I added extra role field so I need to infer the types of the user on the client side too
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies()],
});
