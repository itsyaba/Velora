import { SignupForm } from "@/components/auth/signup-form";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const initialEmail = typeof params?.email === "string" ? params.email : "";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm initialEmail={initialEmail} />
      </div>
    </div>
  );
}
