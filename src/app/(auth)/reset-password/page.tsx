import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;
  //localhost:3000/api/auth/reset-password/ErXQrQSJzDqH7C61BV5NqzKE?callbackURL=%2Freset-password

  http: return (
    <main className="flex min-h-svh items-center justify-center px-4">
      {token ? (
        <ResetPasswordUI token={token} />
      ) : (
        <div role="alert" className="text-red-600">
          Token is missing.
        </div>
      )}
    </main>
  );
}

interface ResetPasswordUIProps {
  token: string;
}

function ResetPasswordUI({ token }: ResetPasswordUIProps) {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-muted-foreground">Enter your new password below.</p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}
