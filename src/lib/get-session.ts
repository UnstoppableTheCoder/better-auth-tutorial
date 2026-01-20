import { headers } from "next/headers";
import { auth } from "./auth";
import { cache } from "react";

// This way this function keeps sending a request to the server to get the session over & over
// export async function getServerSession() {
//   console.log("getServerSession");
//   return await auth.api.getSession({ headers: await headers() });
// }

// When you use cache
export const getServerSession = cache(async () => {
  // As long as, you are the the on the same page, cached getServerSession will be used
  console.log("getServerSession");
  return await auth.api.getSession({ headers: await headers() });
});
