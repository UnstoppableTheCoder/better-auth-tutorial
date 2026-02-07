"use server";

import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";
import { setTimeout } from "node:timers/promises";

export async function deleteApplication() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized(); // it doesn't redirect rather returns 401 code because you are on server actions page
  if (user.role !== "admin") forbidden(); // returns 403 code, doesn't redirect

  // Delete the user account
  await setTimeout(800);
}
