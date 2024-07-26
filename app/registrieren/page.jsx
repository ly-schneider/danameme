import RegisterForm from "@/components/RegisterForm";
import { getSession } from "@/lib/Session";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Registrieren | DANAMEME",
  };
}

export default async function RegistrierenPage() {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  return (
    <main className="mt-24">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <h1 className="title">Registrieren</h1>
        <RegisterForm />
      </section>
    </main>
  );
}