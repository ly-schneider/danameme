"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiBell, mdiBellOutline, mdiBookmark, mdiBookmarkOutline, mdiCog, mdiCogOutline, mdiHome, mdiHomeOutline, mdiLogout, mdiMagnify, mdiTrophy, mdiTrophyOutline } from "@mdi/js";
import IconPodiumOutline from "../icons/IconPodiumOutline";
import IconPodium from "../icons/IconPodium";
import ProfileImage from "../ProfileImage";
import BackendUrl from "../utils/BackendUrl";
import { Skeleton } from "../ui/skeleton";
import { logout } from "@/lib/Session";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons";

export default function NavigationLoggedIn({ session }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    fetchAccount();
  }, []);

  async function fetchAccount() {
    try {
      const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        }
      });

      if (!res.ok || res.status !== 200) {
        throw new Error()
      }

      const data = await res.json();

      if (data.success === false) {
        throw new Error();
      }

      setAccount(data.data);
    } catch (error) {
      console.error("An error occurred while fetching the account data.");
    }
  }

  const closeSheet = () => setOpen(false);

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    closeSheet();
    await logout();
    router.push("/anmelden");
  }

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
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/") ? "font-extrabold" : "")} href="/">
                <Icon path={isActive("/") ? mdiHome : mdiHomeOutline} size={1.15} />
                Home
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/suchen") ? "font-extrabold" : "")} href="/suchen">
                <Icon path={mdiMagnify} size={1.15} />
                Suchen
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/mitteilungen") ? "font-extrabold" : "")} href="/mitteilungen">
                <Icon path={isActive("/mitteilungen") ? mdiBell : mdiBellOutline} size={1.15} />
                Mitteilungen
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/gespeichert") ? "font-extrabold" : "")} href="/gespeichert">
                <Icon path={isActive("/gespeichert") ? mdiBookmark : mdiBookmarkOutline} size={1.15} />
                Gespeichert
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/rangliste") ? "font-extrabold" : "")} href="/rangliste">
                {isActive("/rangliste") ? <IconPodium className="ms-1 me-1 text-xl" /> : <IconPodiumOutline className="ms-1 me-1 text-xl" />}
                Rangliste
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/motm") ? "font-extrabold" : "")} href="/motm">
                <Icon path={isActive("/motm") ? mdiTrophy : mdiTrophyOutline} size={1.1} className="ms-0.5" />
                MOTM
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"nav-link " + (isActive("/profil") ? "font-extrabold" : "")} href="/profil">
                {account === null ? <Skeleton className="w-7 h-7 bg-muted rounded-full ms-0.5" /> : <ProfileImage src={account.profileImage} width={28} height={28} className="ms-0.5" alt={`Profilbild von ${account.username}`} />}
                Profil
              </Link>
            </li>
            <li>
              <Link onClick={closeSheet} className={"btn btn-primary font-effra font-medium text-lg " + (isActive("/posten") ? "font-extrabold" : "")} href="/posten">
                Posten
              </Link>
            </li>
          </ul>
          <div className="block mt-auto">
            <ul className="flex flex-col gap-4">
              <li>
                <Link onClick={closeSheet} className={"nav-link " + (isActive("/einstellungen") ? "font-extrabold" : "")} href="/einstellungen">
                  <Icon path={isActive("/einstellungen") ? mdiCog : mdiCogOutline} size={1.15} className="ms-0.5" />
                  Einstellungen
                </Link>
              </li>
              <li>
                <button type="button" className={"nav-link"} onClick={handleLogout}>
                  <Icon path={mdiLogout} size={1.15} className="ms-[1px] rotate-180" />
                  Logout
                </button>
              </li>
            </ul>
            <div className="flex flex-row flex-wrap gap-4 gap-y-1 mt-4">
              <Link href="/impressum" className="text text-sm text-muted hover:underline">Impressum</Link>
              <Link href="/datenschutz" className="text text-sm text-muted hover:underline">Datenschutz</Link>
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
              <Link className={"nav-link " + (isActive("/") ? "font-extrabold" : "")} href="/">
                <Icon path={isActive("/") ? mdiHome : mdiHomeOutline} size={1.15} />
                Home
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/suchen") ? "font-extrabold" : "")} href="/suchen">
                <Icon path={mdiMagnify} size={1.15} />
                Suchen
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/mitteilungen") ? "font-extrabold" : "")} href="/mitteilungen">
                <Icon path={isActive("/mitteilungen") ? mdiBell : mdiBellOutline} size={1.15} />
                Mitteilungen
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/gespeichert") ? "font-extrabold" : "")} href="/gespeichert">
                <Icon path={isActive("/gespeichert") ? mdiBookmark : mdiBookmarkOutline} size={1.15} />
                Gespeichert
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/rangliste") ? "font-extrabold" : "")} href="/rangliste">
                {isActive("/rangliste") ? <IconPodium className="ms-1 me-1 text-xl" /> : <IconPodiumOutline className="ms-1 me-1 text-xl" />}
                Rangliste
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/motm") ? "font-extrabold" : "")} href="/motm">
                <Icon path={isActive("/motm") ? mdiTrophy : mdiTrophyOutline} size={1.1} className="ms-0.5" />
                MOTM
              </Link>
            </li>
            <li>
              <Link className={"nav-link " + (isActive("/profil") ? "font-extrabold" : "")} href="/profil">
                {account === null ? <Skeleton className="w-7 h-7 bg-muted rounded-full ms-0.5" /> : <ProfileImage src={account.profileImage} width={28} height={28} className="ms-0.5" alt={`Profilbild von ${account.username}`} />}
                Profil
              </Link>
            </li>
            <li>
              <Link className={"btn btn-primary font-effra font-medium text-lg " + (isActive("/posten") ? "font-extrabold" : "")} href="/posten">
                Posten
              </Link>
            </li>
          </ul>
          <div className="hidden nav:block mt-auto">
            <ul className="flex flex-col gap-4">
              <li>
                <Link className={"nav-link " + (isActive("/einstellungen") ? "font-extrabold" : "")} href="/einstellungen">
                  <Icon path={isActive("/einstellungen") ? mdiCog : mdiCogOutline} size={1.15} className="ms-0.5" />
                  Einstellungen
                </Link>
              </li>
              <li>
                <button type="button" className={"nav-link"} onClick={handleLogout}>
                  <Icon path={mdiLogout} size={1.15} className="ms-[1px] rotate-180" />
                  Logout
                </button>
              </li>
            </ul>
            <div className="flex flex-row flex-wrap gap-4 gap-y-1 mt-4">
              <Link href="/impressum" className="text text-sm text-muted hover:underline">Impressum</Link>
              <Link href="/datenschutz" className="text text-sm text-muted hover:underline">Datenschutz</Link>
            </div>
          </div>
        </nav>
      </aside>
    </Sheet>
  );
}