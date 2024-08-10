import ContainerInner from "@/components/ContainerInner";
import Link from "next/link";

export async function generateMetadata() {
  return {
    title: "Datenschutzerklärung | Digiteach.me",
  };
}

export default async function DatenschutzPage() {
  return (
    <ContainerInner>
      <main>
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="title text-center">
            Datenschutzerklärung
          </h1>
          <section>
            <p className="text text-center mt-4">Aktualisiert am 28.07.2024</p>
            <div className="flex flex-col gap-12 mt-12">
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">1. Allgemeine Hinweise</h3>
                <p className="text">
                  Der Schutz Ihrer persönlichen Daten ist uns sehr wichtig. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzrichtlinie.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="subtitle">2. Verantwortliche Stelle</h3>
                <div className="flex flex-col gap-1">
                  <h4 className="subtitle text-lg">Verantwortlich für die Datenverarbeitung:</h4>
                  <p className="text">
                    Levyn Schneider<br />
                    Neumattstrasse 26<br />
                    CH-3127 Mühlethurnen
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="subtitle text-lg">Kontakt:</h4>
                  <p className="text">
                    E-Mail Adresse: <Link
                      href="mailto:kontakt@danameme.ch"
                      target="_blank"
                      className="underline"
                    >
                      kontakt@danameme.ch
                    </Link>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">3. Erhobene Daten</h3>
                <p className="text">
                  Wir erheben und verarbeiten die folgenden personenbezogenen Daten:
                </p>
                <ul className="flex flex-col gap-1 [&]:list-disc [&]:ms-5 [&>li]:py-1 text">
                  <li>
                    <span className="font-bold">Erstellungsdatum des Accounts:</span> Zum Nachvollziehen des Zeitpunktes der Registrierung.
                  </li>
                  <li>
                    <span className="font-bold">Vorname und Nachname:</span> Für nicht öffentliche Zwecke, z.B. für die Kommunikation mit dem Nutzer.
                  </li>
                  <li>
                    <span className="font-bold">Nutzername:</span> Zum öffentlichen Anzeigen auf der Plattform.
                  </li>
                  <li>
                    <span className="font-bold">E-Mail Adresse:</span> Für den Login und zur Kommunikation.
                  </li>
                  <li>
                    <span className="font-bold">Passwort:</span> Für den Login (verschlüsselt gespeichert).
                  </li>
                  <li>
                    <span className="font-bold">Karma:</span> Bewertungssystem der Plattform.
                  </li>
                  <li>
                    <span className="font-bold">E-Mail Adresse verifiziert:</span> Status der E-Mail-Verifizierung.
                  </li>
                  <li>
                    <span className="font-bold">Gesperrt:</span> Status der Account-Sperrung.
                  </li>
                  <li>
                    <span className="font-bold">Beiträge und Kommentare:</span> Alle erstellten Beiträge und Kommentare werden dauerhaft gespeichert, es sei denn, sie werden vom Nutzer gelöscht oder aus rechtlichen Gründen entfernt.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">4. Verwendung von Google Analytics</h3>
                <p className="text">
                  Diese Website benutzt Google Analytics, einen Webanalysedienst der Google Inc. Google Analytics verwendet sogenannte &quot;Cookies&quot;, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieser Website werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.
                </p>
                <ul className="flex flex-col gap-1 [&]:list-disc [&]:ms-5 [&>li]:py-1 text">
                  <li>
                    <span className="font-bold">Page Views und andere analytische Daten:</span> Diese Daten werden genutzt, um die Nutzung der Website zu analysieren und zu verbessern.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">5. Zweck der Datenerhebung</h3>
                <p className="text">
                  Wir verwenden die erhobenen Daten für folgende Zwecke:
                </p>
                <ul className="flex flex-col gap-1 [&]:list-disc [&]:ms-5 [&>li]:py-1 text">
                  <li>
                    Bereitstellung und Verbesserung unserer Plattform.
                  </li>
                  <li>
                    Verwaltung Ihres Nutzerkontos.
                  </li>
                  <li>
                    Kommunikation mit Ihnen.
                  </li>
                  <li>
                    Analyse des Nutzerverhaltens zur Verbesserung unserer Services.
                  </li>
                  <li>
                    Einhaltung rechtlicher Verpflichtungen.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">6. Rechtsgrundlage der Verarbeitung</h3>
                <p className="text">
                  Die Verarbeitung Ihrer Daten erfolgt auf der Grundlage der folgenden Rechtsgrundlagen:
                </p>
                <ul className="flex flex-col gap-1 [&]:list-disc [&]:ms-5 [&>li]:py-1 text">
                  <li>
                    <span className="font-bold">Einwilligung:</span> Sie haben der Verarbeitung Ihrer Daten für bestimmte Zwecke zugestimmt.
                  </li>
                  <li>
                    <span className="font-bold">Vertrag:</span> Die Verarbeitung ist notwendig, um einen Vertrag mit Ihnen zu erfüllen oder um auf Ihre Anfrage hin Massnahmen zu ergreifen.
                  </li>
                  <li>
                    <span className="font-bold">Rechtliche Verpflichtungen:</span> Wir sind gesetzlich verpflichtet, bestimmte Daten zu verarbeiten.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">7. Datenspeicherung und -sicherheit</h3>
                <p className="text">
                  Ihre personenbezogenen Daten werden auf sicheren Servern in der USA gespeichert. Wir ergreifen geeignete technische und organisatorische Massnahmen, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">8. Weitergabe von Daten an Dritte</h3>
                <p className="text">
                  Wir geben Ihre personenbezogenen Daten nicht an Dritte weiter, ausser:
                </p>
                <ul className="flex flex-col gap-1 [&]:list-disc [&]:ms-5 [&>li]:py-1 text">
                  <li>
                    Sie haben ausdrücklich eingewilligt.
                  </li>
                  <li>
                    Die Weitergabe ist zur Erfüllung unserer vertraglichen Verpflichtungen erforderlich.
                  </li>
                  <li>
                    Wir sind gesetzlich dazu verpflichtet.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">9. Ihre Rechte</h3>
                <p className="text">
                  Sie haben das Recht:
                </p>
                <ul className="flex flex-col gap-1 [&]:list-disc [&]:ms-5 [&>li]:py-1 text">
                  <li>
                    Auskunft über Ihre bei uns gespeicherten Daten zu erhalten.
                  </li>
                  <li>
                    Berichtigung unrichtiger Daten zu verlangen.
                  </li>
                  <li>
                    Löschung Ihrer Daten zu verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                  </li>
                  <li>
                    Einschränkung der Verarbeitung Ihrer Daten zu verlangen.
                  </li>
                  <li>
                    Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen.
                  </li>
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">10. Änderungen dieser Datenschutzrichtlinie</h3>
                <p className="text">
                  Wir behalten uns vor, diese Datenschutzrichtlinie jederzeit zu ändern. Die aktuelle Version ist stets auf unserer Website verfügbar.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="subtitle">11. Kontakt</h3>
                <p className="text">
                  Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf erteilter Einwilligungen wenden Sie sich bitte an unsere Verantwortliche Stelle.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ContainerInner>
  );
}