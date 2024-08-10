import ContainerInner from "@/components/ContainerInner";
import LoginForm from "@/components/LoginForm";
import SettingsHandler from "@/components/settings/SettingsHandler";
import { getSession } from "@/lib/Session";

export async function generateMetadata() {
  return {
    title: "Einstellungen | DANAMEME",
  };
}

export default async function SettingsPage() {
  const session = await getSession();

  return (
    <ContainerInner>
      <main className="mt-12">
        <section className="flex flex-col max-w-md w-full mx-auto">
          <h1 className="title">Einstellungen</h1>
          <SettingsHandler session={session} />
        </section>
      </main>
    </ContainerInner>
  );
}