"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiAccountPlus, mdiAccountPlusOutline, mdiLogin } from "@mdi/js";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";

export default function NavigationLoggedOut() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  const isActive = (path) => pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle>
        <VisuallyHidden.Root>
          Menu
        </VisuallyHidden.Root>
      </SheetTitle>
      <SheetContent side="left">
        <div className="flex flex-col h-full">
          <ul className="flex flex-col gap-4 mt-8">
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/anmelden") ? "font-extrabold" : null)} href="/anmelden">
                <Icon path={mdiLogin} size={1.15} />
                Anmelden
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/registrieren") ? "font-extrabold" : null)} href="/registrieren">
                <Icon path={isActive("/registrieren") ? mdiAccountPlus : mdiAccountPlusOutline} size={1.15} />
                Registrieren
              </Link>
            </li>
          </ul>
          <div className="mt-auto">
            <div className="flex flex-row flex-wrap gap-4 gap-y-1 mt-4">
              <Link onClick={closeSheet} href="/impressum" className="text text-sm text-muted hover:underline">Impressum</Link>
              <Link onClick={closeSheet} href="/datenschutz" className="text text-sm text-muted hover:underline">Datenschutz</Link>
              <Link onClick={closeSheet} target="_blank" href="https://github.com/ly-schneider/danameme" className="text text-sm text-muted hover:underline">GitHub</Link>
            </div>
          </div>
        </div>
      </SheetContent>
      <aside className="nav:h-screen w-full nav:w-[18rem] bg-background fixed">
        <nav className="px-6 py-4 nav:p-6 flex flex-col min-h-full">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <img src="/images/danameme-logo.png" alt="DANAMEME Logo" className="w-52 nav:w-full h-auto" />
            </div>
            <SheetTrigger asChild>
              <Button
                className="btn px-0 py-0 nav:hidden"
                size="icon"
                variant="transparent"
              >
                <FontAwesomeIcon
                  icon={faBarsStaggered}
                  className="text-lg"
                />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <ul className="hidden nav:flex flex-col gap-4 mt-8">
            <li>
              <Link className={"nav-link " + (isActive("/anmelden") ? "font-extrabold" : null)} href="/anmelden">
                <Icon path={mdiLogin} size={1.15} />
                Anmelden
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/registrieren") ? "font-extrabold" : null)} href="/registrieren">
                <Icon path={isActive("/registrieren") ? mdiAccountPlus : mdiAccountPlusOutline} size={1.15} />
                Registrieren
              </Link>
            </li>
          </ul>
          <div className="hidden nav:block mt-auto">
            <div className="flex flex-row flex-wrap gap-4 gap-y-1">
              <Link href="/impressum" className="text text-sm text-muted hover:underline">Impressum</Link>
              <Link href="/datenschutz" className="text text-sm text-muted hover:underline">Datenschutz</Link>
              <Link target="_blank" href="https://github.com/ly-schneider/danameme" className="text text-sm text-muted hover:underline">GitHub</Link>
            </div>
          </div>
        </nav>
      </aside>
    </Sheet>
  );
}