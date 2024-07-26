import LoginForm from "@/components/LoginForm";
import { getSession } from "@/lib/Session";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Anmelden | DANAMEME",
  };
}

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="mt-24">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <h1 className="title">Anmelden</h1>
        <LoginForm />
      </section>
    </main>
  );
}