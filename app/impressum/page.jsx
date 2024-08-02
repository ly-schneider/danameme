import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Impressum | Digiteach.me",
  };
}

export default async function ImpressumPage() {
  return (
    <main>
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="title text-4xl text-center">Impressum</h1>
        <section className="mt-12 flex flex-col gap-12">
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
              <Link
                href="mailto:kontakt@danameme.ch"
                target="_blank"
                className="underline"
              >
                kontakt@danameme.ch
              </Link>{" "}
            </p>
          </div>
          <div>
            <h2 className="title text-3xl">Disclaimer</h2>
            <div className="flex flex-col gap-6 mt-2">
              <div>
                <h4 className="subtitle">Haftung für Inhalte</h4>
                <p className="text mt-2">
                  Als Diensteanbieter sind wir gemäss den geltenden Gesetzen für eigene Inhalte auf diesen Seiten verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>
                <p className="text mt-2">
                  Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                </p>
              </div>
              <div>
                <h4 className="subtitle">Haftung für Links</h4>
                <p className="text mt-2">
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                </p>
                <p className="text mt-2">
                  Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                </p>
              </div>
              <div>
                <h4 className="subtitle">Urheberrecht</h4>
                <p className="text mt-2">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
                <p className="text mt-2">
                  Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}