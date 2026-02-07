import type { Metadata } from "next";
import { DeleteApplication } from "./delete-application";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) unauthorized(); // it redirects the user to the unauthorized page & it's been configured in next.config.ts file

  if (user.role !== "admin") forbidden(); // Redirects the user to the forbidden page

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-muted-foreground">
            You have administrator access.
          </p>
        </div>
        <DeleteApplication />
      </div>
    </main>
  );
}
