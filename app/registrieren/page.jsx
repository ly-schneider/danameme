import RegisterHandler from "@/components/register/RegisterHandler";

export async function generateMetadata() {
  return {
    title: "Registrieren | DANAMEME",
  };
}

export default async function RegistrierenPage() {
  return (
    <main className="mt-12">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <h1 className="title">Registrieren</h1>
        <RegisterHandler />
      </section>
    </main>
  );
}