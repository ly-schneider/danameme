import ForgotPassword from "@/components/ForgotPassword";

export async function generateMetadata() {
  return {
    title: "Passwort vergessen | DANAMEME",
  };
}

export default async function ForgotPasswordPage() {
  return (
    <main className="mt-12">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <ForgotPassword />
      </section>
    </main>
  );
}