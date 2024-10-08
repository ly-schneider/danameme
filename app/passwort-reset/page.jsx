import ContainerInner from "@/components/ContainerInner";
import PasswordReset from "@/components/PasswordReset";
import { getSession } from "@/lib/Session";

export default async function PasswordResetPage() {
  const session = await getSession();

  return (
    <ContainerInner>
      <main className="mt-12">
        <section className="flex flex-col max-w-md w-full mx-auto">
          <PasswordReset session={session} />
        </section>
      </main>
    </ContainerInner>
  );
}