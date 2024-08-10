import ContainerInner from "@/components/ContainerInner";
import LoginForm from "@/components/LoginForm";

export async function generateMetadata() {
  return {
    title: "Anmelden | DANAMEME",
  };
}

export default async function LoginPage() {
  return (
    <ContainerInner>
      <main className="mt-12">
        <section className="flex flex-col max-w-md w-full mx-auto">
          <h1 className="title">Anmelden</h1>
          <LoginForm />
        </section>
      </main>
    </ContainerInner>
  );
}