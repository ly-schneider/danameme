"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import RenderPosition from "./RenderPosition";
import { useEffect, useState } from "react";
import BackendUrl from "../utils/BackendUrl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { faCircleQuestion, faCircleUser, faPaperPlane, faUser } from "@fortawesome/free-regular-svg-icons";
import { mdiCogOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { logout } from "@/lib/Session";
import { useRouter } from "next/navigation";

export default function NavigationLoggedIn({ session }) {
  const router = useRouter();
  const pathname = usePathname();

  const [account, setAccount] = useState(null);

  useEffect(() => {
    // fetchAccount();
  }, []);

  async function fetchAccount() {
    try {
      const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        }
      });

      if (!res.ok) {
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

  return (
    <Sheet>
      <SheetContent side="right">
        <div className="flex flex-col gap-4 mt-8">
          <Link className={"text text-lg flex w-full items-center hover:underline " + (pathname == "/" ? "underline" : "")} href="/">
            Home
          </Link>
          <Link className={"text text-lg flex w-full items-center hover:underline " + (pathname == "/ueber" ? "underline" : "")} href="/ueber">
            Über
          </Link>
        </div>
      </SheetContent>
      <nav className={`w-full my-6 ${RenderPosition(pathname)}`}>
        <div className={`w-full px-8 mx-auto max-w-7xl`}>
          <div className="flex flex-row w-full items-center justify-between md:justify-normal">
            <div className="md:w-1/3 flex flex-row items-center">
              <div className="">
                <Link href="/">
                  <img
                    src="/digiteach-me.png"
                    alt="Digiteach.me Logo"
                    className="w-auto h-8 sm:h-9"
                  />
                </Link>
              </div>
            </div>
            <div className="flex flex-row md:w-2/3 gap-4 sm:gap-10">
              <div className="md:w-full flex flex-row justify-end md:justify-center items-center">
                <ul className="flex text space-x-10 items-center">
                  <li
                    className={
                      "hover:underline hidden sm:flex " +
                      (pathname == "/" ? "underline" : "")
                    }
                  >
                    <Link href="/">
                      <p>Home</p>
                    </Link>
                  </li>
                  <li
                    className={
                      "hover:underline hidden sm:flex " +
                      (pathname == "/ueber" ? "underline" : "")
                    }
                  >
                    <Link href="/ueber">
                      <p>Über</p>
                    </Link>
                  </li>
                  <li className="sm:hidden">
                    <SheetTrigger asChild>
                      <Button
                        className="btn px-0 py-0"
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
                  </li>
                </ul>
              </div>
              <div className="md:w-full flex justify-end items-center gap-6">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={"flex flex-row gap-2 items-center btn btn-primary px-4 sm:px-6 group"}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-lg"
                    />
                    <p className="text group-hover:text-background transition-default hidden sm:block">{account ? account.firstname : "Account"}</p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-background hover:bg-background focus:bg-background w-48 hover:!rounded-2xl focus:!rounded-2xl"
                    sideOffset={10}
                    side={"bottom"}
                    align={"end"}
                    alignOffset={10}
                  >
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="px-[9px]">
                        <Link href="/account" className="flex">
                          <Icon
                            path={mdiCogOutline}
                            size={0.8}
                            className="me-1"
                          />
                          Einstellungen
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuLabel>Für Lehrpersonen</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link href="/bewerben">
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className="me-2"
                          />
                          Bewerben
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    {/* <DropdownMenuLabel>Support</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link href="/hilfecenter">
                          <FontAwesomeIcon
                            icon={faCircleQuestion}
                            className="me-2"
                          />
                          Hilfe
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup> */}
                    <DropdownMenuSeparator
                      className={"mx-3 mt-4 bg-mutedLight"}
                    />
                    <DropdownMenuItem>
                      <button
                        onClick={async () => {
                          await logout();
                          router.push("/");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faArrowRightFromBracket}
                          className="me-2"
                        />
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </Sheet>
  );
}