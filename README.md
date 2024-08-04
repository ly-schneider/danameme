# DANAMEME

✨ Die Open-Source Meme-Plattform vom ICT-Campus der Post.

## Über DANAMEME

DANAMEME wurde damals erstellt, weil wir im Campus, IT & Campus-Memes irgendwo posten und teilen wollten. Deshalb habe ich, Levyn, mich drangesetzt und die erste Version von DANAMEME erstellt. Jetzt sind wir bereits bei der aktuellen und zweiten Version von DANAMEME für die zukünftigen Jahrgänge.

## Tech Stack

Frontend:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwindcss](https://tailwindcss.com/)

Backend & Datenbank:
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)

Anderes:
- [Azure](https://azure.microsoft.com/de-de) (Speicher)
- [Imgix](https://www.imgix.com/) (CDN)
- [Terraform](https://www.terraform.io/) (IaC)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass) (MongoDB GUI)
- [Mailgun](https://www.mailgun.com/) (E-Mail Anbieter)
- [Infomaniak](https://www.infomaniak.com/de) (Domain)
- [Vercel](https://vercel.com/) (Hosting)
- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) (MongoDB Cloud Datenbank)


## Mithelfen

Wenn du denkst du hast ein Fehler gefunden oder du möchtest irgendetwas optimieren, dann folge diesem Guide für das aufsetzten von DANAMEME lokal.

## Installation

Installiere Node:\
[https://nodejs.org/en/download/package-manager](https://nodejs.org/en/download/package-manager)

Installiere Git:\
[https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Installiere Terraform:\
[https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)

Installiere die Azure-Befehlszeilenschnittstelle:\
[https://learn.microsoft.com/de-de/cli/azure/install-azure-cli](https://learn.microsoft.com/de-de/cli/azure/install-azure-cli)

Installliere die MongoDB Community Edition:\
[https://www.mongodb.com/docs/manual/installation/](https://www.mongodb.com/docs/manual/installation/)

Installiere MongoDB Compass (optional):\
[https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

Klone das Git Repository:\
`git clone https://github.com/ly-schneider/danameme`

Gehe in den Ordner:\
`cd danameme`

Installiere die Module:\
`npm install`

Logge dich in Azure ein:\
`az login`

Bewege dich in den Terraform Ordner und initialisiere Terraform:\
`cd terraform && terraform init`

Plane Terraform (optional):\
`terraform plan`

Führe Terraform aus:\
`terraform apply`

Nach dem Aufsetzten von den/dem Storage Account(s) rufe den/eine der Connection String(s) ab.\
`terraform output storage_account_{prod|dev}_primary_connection_string`

Erstelle eine `.env.local` Datei im Hauptverzeichnis

### Umgebungsvariablen

- `MONGODB_URI`: Eine URI für die Datenbank Verbindung. Nutze dazu: `mongodb://localhost:27017/danameme`
- `JWT_SECRET`: Ein frei wählbarer Schlüssel für die Ver- und Entschlüsslung des JWT Tokens
- `NEXT_PUBLIC_API_URL`: Eine URL für die Backend Verbindung. Nutze dazu: `http://localhost:3000/api`
- `AZURE_CONNECTION_STRING`: Der ausgewählte Connection String von Terraform. Im Format: `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={accountKey};EndpointSuffix=core.windows.net`
- `IMAGE_URL`: Eine URL für das speichern des Bildpfads in der Datenbank. Wenn du kein CDN verwendest (z.B. Imgix) dann nutze dazu: `{storageAccountName}.blob.core.windows.net`(kein https o.Ä)
- `MAILGUN_API_KEY` & `MAILGUN_DOMAIN` (optional): Wenn du Lust auf einen E-Mail Anbieter hast, kannst du Mailgun verwenden und diese Werte ausfüllen.

### MongoDB Compass

Verifiziere das MongoDB als Service im Hintergrund läuft. Dies sollte eigentlich nach der Installation von MongoDB Community Edition bereits der Fall sein. 

Starte MongoDB Compass. Sobald du zum "New Connection" Bildschirm kommst füge die URI: `mongodb://localhost:27017/danameme` ein und verbinde dich.

### Viel Spass

Um richtig loszulegen starte jetzt noch die Next Entwicklungsumgebung mit `npm run dev` im Hauptverzeichnis.