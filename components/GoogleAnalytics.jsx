"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function GoogleAnalytics() {
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookieConsent")) {
      setShowCookieConsent(true);
    }
  }, []);

  function handleClick() {
    setShowCookieConsent(false);
    localStorage.setItem("cookieConsent", true);
  }

  return (
    <>
      <div className={`fixed bottom-0 z-50 text bg-background border-2 max-w-md border-border rounded-xl px-4 py-3 mx-8
      ${showCookieConsent ? "block" : "hidden"} mb-5`}>
        <p className="text text-sm mb-1">Durch die Nutzung dieser Website erklärst du sich automatisch mit der Verwendung von Cookies und unseren Datenschutzrichtlinien einverstanden.</p>
        <Link href="/datenschutz" className="text text-sm text-primaryText underline">Mehr erfahren</Link>
        <div className="text-end mt-3 w-full flex flex-col sm:flex-row gap-3 justify-end">
          <button type="button" className="btn btn-primary text-sm py-1.5 order-1 sm:order-2" onClick={handleClick}>OK</button>
        </div>
      </div>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-MP1DDV8R99"></Script>
      <Script id="gtag-script">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-MP1DDV8R99');
        `}
      </Script>
    </>
  );
}
