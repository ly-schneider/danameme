import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Datenschutzrichtlinien | Digiteach.me",
  };
}

export default async function DatenschutzPage() {
  return (
    <main className="mb-64">
      <section className="flex flex-col items-center max-w-6xl mx-auto py-6 px-8">
        <h1 className="title text-4xl">Datenschutzrichtlinien</h1>
        <p className="text mt-2 text-muted">Aktualisiert: 07.07.2024</p>
      </section>
      <section className="max-w-4xl mx-auto mt-12 flex flex-col gap-12 px-8">
        <div>
          <h2 className="title text-2xl">1. Einleitung</h2>
          <p className="text mt-4">
            Willkommen bei Digiteach.me! Der Schutz Ihrer Daten ist uns sehr wichtig. Diese Datenschutzrichtlinien erklären, welche personenbezogenen Daten wir erfassen und wie wir diese Daten verwenden und schützen. Diese Richtlinien gelten in Übereinstimmung mit dem Schweizer Datenschutzgesetz (DSG) und der Datenschutz-Grundverordnung (DSGVO) der Europäischen Union.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">2. Verantwortliche Stelle</h2>
          <p className="text mt-4">
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
          </p>
          <p className="text mt-4">
            <a href="https://leys.ch" target="_blank" className="underline">
              Leys Services
            </a><br />
            Levyn Schneider <br />
            Neumattstrasse 26 <br />
            CH-3127 Mühlethurnen <br />
            <a href="mailto:contact@leys.ch" className="underline">
              contact@leys.ch
            </a>
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">3. Datenerfassung</h2>
          <p className="text mt-4">
            Aktuell erfasst Digiteach.me nur eine Art von personenbezogenen Daten:
          </p>
          <ul className="mt-4 gap-4 flex flex-col ul-list">
            <li className="text">
              <span className="font-bold">E-Mail-Adresse:</span> Wenn Sie sich in unsere Warteliste eintragen, erfassen wir Ihre E-Mail-Adresse, um Sie über die Verfügbarkeit und Neuigkeiten unserer Plattform zu informieren.
            </li>
          </ul>
          <p className="text mt-4">
            Zusätzlich erfassen wir durch den Einsatz von Analysetools Daten über die Nutzung unserer Website.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">4. Zweck der Datenerfassung</h2>
          <p className="text mt-4">
            Die erfassten E-Mail-Adressen und Nutzungsdaten werden zu folgenden Zwecken verwendet:
          </p>
          <ul className="mt-4 gap-4 flex flex-col ul-list">
            <li className="text">
              <span className="font-bold">Kommunikation:</span> Wir verwenden Ihre E-Mail-Adresse, um Ihnen Informationen und Updates bezüglich Digiteach.me zuzusenden.
            </li>
            <li className="text">
              <span className="font-bold">Verwaltung der Warteliste:</span> Ihre E-Mail-Adresse wird verwendet, um Sie über die Verfügbarkeit und Neuigkeiten unserer Plattform zu informieren.
            </li>
            <li className="text">
              <span className="font-bold">Website-Analyse:</span> Wir verwenden Analysetools wie Google Analytics, um zu verstehen, wie Nutzer unsere Website verwenden. Diese Informationen helfen uns, die Benutzererfahrung zu verbessern.
            </li>
            <li className="text">
              <span className="font-bold">Optionale Updates:</span> Ihre E-Mail-Adresse wird verwendet, um Ihnen optionale Updates über unsere Website und Dienstleistungen zu senden, sofern Sie dem zugestimmt haben.
            </li>
            <li className="text">
              <span className="font-bold">Rabattaktionen:</span> Ihre E-Mail-Adresse wird verwendet, um Ihnen mögliche Rabattaktionen und Angebote zuzusenden, die Ihnen beim Registrierungsprozess helfen können.
            </li>
          </ul>
        </div>
        <div>
          <h2 className="title text-2xl">5. Rechtsgrundlage für die Verarbeitung</h2>
          <p className="text mt-4">
            Die Verarbeitung Ihrer E-Mail-Adresse erfolgt auf Grundlage Ihrer Einwilligung:
          </p>
          <ul className="mt-4 gap-4 flex flex-col ul-list">
            <li className="text">
              Nach DSGVO (Art. 6 Abs. 1 lit. a): Indem Sie Ihre E-Mail-Adresse in das Formular eintragen, erklären Sie sich mit der Verarbeitung Ihrer Daten gemäß dieser Datenschutzrichtlinie einverstanden.
            </li>
            <li className="text">
              Nach DSG: Die Verarbeitung erfolgt im Rahmen Ihrer Einwilligung und zur Erfüllung der genannten Zwecke.
            </li>
          </ul>
          <p className="text mt-4">
            Die Verarbeitung der Nutzungsdaten erfolgt auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO), unser Webangebot zu verbessern und statistische Analysen durchzuführen.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">6. Nutzung von Analysetools</h2>
          <p className="text mt-4">
            Wir verwenden Google Analytics und ähnliche Analysetools, um Informationen über die Nutzung unserer Website zu sammeln. Diese Tools erfassen Informationen wie:
          </p>
          <ul className="mt-4 gap-4 flex flex-col ul-list">
            <li className="text">
              Besuchte Seiten
            </li>
            <li className="text">
              Verweildauer auf den Seiten
            </li>
            <li className="text">
              Verwendete Geräte und Browser
            </li>
            <li className="text">
              Herkunft der Besucher (z.B. Suchmaschinen, Verweiswebsites)
            </li>
          </ul>
          <p className="text mt-4">
            Google Analytics verwendet Cookies, um diese Informationen zu sammeln. Die Daten werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert. Google ist unter dem EU-US Data Privacy Framework zertifiziert, wodurch ein angemessenes Datenschutzniveau gewährleistet wird.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">7. Opt-Out-Möglichkeit</h2>
          <p className="text mt-4">
            Sie können die Erfassung Ihrer Daten durch Google Analytics verhindern, indem Sie das <Link href={"https://tools.google.com/dlpage/gaoptout"} target="_blank" className="underline">Google Analytics Opt-out Browser Add-on</Link> installieren.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">8. Speicherung und Löschung von Daten</h2>
          <p className="text mt-4">
            Wir speichern Ihre E-Mail-Adresse und Nutzungsdaten nur so lange, wie es notwendig ist, um die oben genannten Zwecke zu erfüllen. Sie können Ihre Einwilligung zur Speicherung und Nutzung Ihrer E-Mail-Adresse jederzeit widerrufen, indem Sie uns über die oben genannte Kontaktadresse kontaktieren. In diesem Fall werden wir Ihre E-Mail-Adresse unverzüglich löschen.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">9. Weitergabe von Daten</h2>
          <p className="text mt-4">
            Ihre E-Mail-Adresse wird nicht an Dritte weitergegeben, verkauft oder anderweitig übertragen, es sei denn, wir sind gesetzlich dazu verpflichtet. Nutzungsdaten können anonymisiert für statistische Analysen an Dritte weitergegeben werden.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">10. Sicherheit Ihrer Daten</h2>
          <p className="text mt-4">
            Wir setzen angemessene technische und organisatorische Maßnahmen ein, um Ihre Daten vor Verlust, Missbrauch und unbefugtem Zugriff zu schützen.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">11. Ihre Rechte</h2>
          <p className="text mt-4">
            Sie haben das Recht:
          </p>
          <ul className="mt-4 gap-4 flex flex-col ul-list">
            <li className="text">
              auf Auskunft über die von uns gespeicherten Daten,
            </li>
            <li className="text">
              auf Berichtigung unrichtiger Daten,
            </li>
            <li className="text">
              auf Löschung Ihrer Daten,
            </li>
            <li className="text">
              auf Einschränkung der Verarbeitung,
            </li>
            <li className="text">
              auf Datenübertragbarkeit,
            </li>
            <li className="text">
              auf Widerspruch gegen die Verarbeitung Ihrer Daten.
            </li>
          </ul>
          <p className="text mt-4">
            Zur Ausübung dieser Rechte können Sie uns jederzeit über die oben angegebene Kontaktadresse kontaktieren.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">12. Internationale Datenübermittlung</h2>
          <p className="text mt-4">
            Da unsere Plattform für Nutzer in verschiedenen Ländern verfügbar ist, kann es notwendig sein, Ihre Daten international zu übermitteln. Wir stellen sicher, dass alle internationalen Datenübermittlungen in Übereinstimmung mit den geltenden Datenschutzgesetzen erfolgen.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">13. Änderungen der Datenschutzrichtlinien</h2>
          <p className="text mt-4">
            Wir behalten uns das Recht vor, diese Datenschutzrichtlinien jederzeit zu ändern. Die jeweils aktuelle Version ist auf unserer Website verfügbar. Änderungen werden wir Ihnen per E-Mail mitteilen, sofern diese Ihre Rechte und Pflichten aus diesen Datenschutzrichtlinien betreffen.
          </p>
        </div>
        <div>
          <h2 className="title text-2xl">14. Kontakt</h2>
          <p className="text mt-4">
            Wenn Sie Fragen zu diesen Datenschutzrichtlinien haben, können Sie uns jederzeit unter der oben angegebenen Kontaktadresse erreichen.
          </p>
        </div>
      </section>
    </main>
  );
}