import ForgotPassword from "@/components/ForgotPassword";
import { Suspense } from "react";

export async function generateMetadata() {
  return {
    title: "Passwort vergessen | DANAMEME",
  };
}

export default async function ForgotPasswordPage() {
  return (
    <main className="mt-12">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <Suspense>
          <ForgotPassword />
        </Suspense>
      </section>
    </main>
  );
}