import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import NavigationHandler from "@/components/navigation/NavigationHandler";
import Container from "@/components/Container";

export const metadata = {
  title: "DANAMEME | Die Meme-Plattform für den ICT-Campus",
  description: "DANAMEME - Die Meme-Plattform für den ICT-Campus",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        <GoogleAnalytics />
        <NavigationHandler />
        <Container>{children}</Container>
        <Toaster position="top-right" expand={true} richColors closeButton />
      </body>
    </html>
  );
}
