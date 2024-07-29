"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useState } from "react";
import Icon from "@mdi/react";
import { mdiAccountPlus, mdiAccountPlusOutline, mdiLogin } from "@mdi/js";

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
        <div className="flex flex-col gap-4 mt-8">
          <Link onClick={closeSheet} className={"text text-lg flex w-full items-center hover:underline " + (pathname == "/" ? "underline" : "")} href="/">
            Home
          </Link>
        </div>
      </SheetContent>
      <aside className="h-screen w-[18rem] bg-background shadow-xl border-r-0 border-[#101f24] fixed">
        <nav className="p-6 flex flex-col min-h-full">
          <img src="/images/danameme-logo.png" alt="DANAMEME Logo" className="w-full h-auto" />
          <ul className="flex flex-col gap-4 mt-8">
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
          <div className="mt-auto">
            <div className="flex flex-row flex-wrap gap-4 gap-y-1">
              <Link href="/impressum" className="text text-sm text-muted hover:underline">Impressum</Link>
              <Link href="/datenschutz" className="text text-sm text-muted hover:underline">Datenschutz</Link>
            </div>
          </div>
        </nav>
      </aside>
    </Sheet>
  );
}