import ContainerInner from "@/components/ContainerInner";
import EmailVerification from "@/components/EmailVerification";
import { getSession } from "@/lib/Session";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "E-Mail Adresse verifizieren | DANAMEME",
  };
}

export default async function RegistrierenPage() {
  const session = await getSession();
  if (session.user.emailVerified) {
    redirect("/");
  }

  return (
    <ContainerInner>
      <main className="mt-12">
        <section className="flex flex-col max-w-md w-full mx-auto">
          <h1 className="title">E-Mail Adresse verifizieren</h1>
          <EmailVerification session={session} />
        </section>
      </main>
    </ContainerInner>
  );
}