import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: "https://better-auth-tutorial-ten.vercel.app/",
  // nextCookies() - mainly needed when working with server actions - Know more about it
  // inferAdditionalFields() -> I added extra role field so I need to infer the types of the user on the client side too
  plugins: [inferAdditionalFields<typeof auth>(), nextCookies()],
});
