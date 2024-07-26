import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Impressum | Digiteach.me",
  };
}

export default async function ImpressumPage() {
  return (
    <main className="mb-64">
      <section className="flex flex-row justify-center max-w-6xl mx-auto py-6 px-8">
        <h1 className="title text-4xl">Impressum</h1>
      </section>
      <section className="max-w-4xl mx-auto mt-12 flex flex-col gap-12 px-8">
        <div>
          <h2 className="title text-3xl">Verantwortlich für den Inhalt dieser Website</h2>
          <p className="text mt-2">
            Levyn Schneider<br />
            Neumattstrasse 26<br />
            CH-3127 Mühlethurnen
          </p>
        </div>
        <div>
          <h2 className="title text-3xl">Kontakt</h2>
          <p className="text mt-2">
            <a
              href="mailto:kontakt@danameme.ch"
              target="_blank"
              className="underline"
            >
              kontakt@danameme.ch
            </a>{" "}
          </p>
        </div>
        <div>
          <h2 className="title text-3xl">Disclaimer</h2>
          <p className="text mt-2">
            Die Informationen auf dieser Website wurden mit grösstmöglicher Sorgfalt zusammengestellt. Dennoch können wir nicht für die Richtigkeit oder Genauigkeit der enthaltenen Informationen garantieren. Gewährleistung oder Haftung jeglicher Art, z.B. für die Richtigkeit, Zuverlässigkeit, Vollständigkeit und Aktualität der Informationen, ist ausgeschlossen so weit diese nicht auf Vorsatz oder grober Fahrlässigkeit beruht. Links: Von dieser Website führen Links auf andere Websites. DANAMEME übernimmt keine Verantwortung für die Inhalte der über diese Links besuchten Websites. Es handelt sich hierbei um fremde Angebote und Informationen, auf deren inhaltliche Gestaltung DANAMEME keinen Einfluss hat und für deren Inhalte DANAMEME auch nicht verantwortlich ist. Sollten Sie Kenntnis von rechtswidrigen Inhalten auf Websites erhalten, die Sie über unsere Website per Link besuchen können, geben Sie uns bitte einen Hinweis, damit wir die Verlinkung prüfen können. Schutzrechte: Alle Rechte an den Inhalten der Website Bildung zu Hause Bern bleiben vorbehalten. Der Inhalt der Website darf ganz oder teilweise nicht zu geschäftlichen Zwecken vervielfältigt, verbreitet, verändert oder Dritten zugänglich gemacht werden.
          </p>
          <p className="text mt-4">
            Illustrationen von{" "}
            <Link href="https://www.freepik.com/" target="_blank" className="underline">www.freepik.com</Link>
          </p>
        </div>
      </section>
    </main>
  );
}