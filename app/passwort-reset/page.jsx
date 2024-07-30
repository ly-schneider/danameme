import PasswordReset from "@/components/PasswordReset";
import { getSession } from "@/lib/Session";

export async function generateMetadata() {
  const session = await getSession();

  return {
    title: `Passwort ${session ? "ändern" : "zurücksetzen"} | DANAMEME`,
  };
}

export default async function PasswordResetPage() {
  const session = await getSession();

  return (
    <main className="mt-12">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <h1 className="title">Passwort {session ? "ändern" : "zurücksetzen"}</h1>
        <PasswordReset session={session} />
      </section>
    </main>
  );
}