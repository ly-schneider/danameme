import Post from "@/components/post/Post";
import ProfileImage from "@/components/ProfileImage";
import { Separator } from "@/components/ui/separator";
import BackendUrl from "@/components/utils/BackendUrl";
import CalcCreationDate from "@/components/utils/CalcCreationDate";
import { getSession } from "@/lib/Session";
import { mdiCogOutline, mdiInformationOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "@/components/utils/Spinner";

export async function generateMetadata({ params }) {
  const session = await getSession();

  let account = null

  if (session) {
    const res = await fetch(`${BackendUrl()}/accounts/username/${params.username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.accessToken}`,
      }
    });

    if (!res.ok || res.status !== 200) {
      console.error("Fehler beim Laden des Accounts")
      return
    }

    const data = await res.json()

    if (data.success) {
      account = data.data
    } else {
      console.error("Fehler beim Laden der Posts")
      return
    }
  }

  return {
    title: `${account.account.username} | Profil | DANAMEME`,
  };
}

export default async function ProfileDetailPage({ params }) {
  const session = await getSession();

  let account = null

  if (session) {
    const res = await fetch(`${BackendUrl()}/accounts/username/${params.username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${session.accessToken}`,
      }
    });

    if (!res.ok || res.status !== 200) {
      console.error("Fehler beim Laden des Accounts")
      return
    }

    const data = await res.json()

    if (data.success) {
      account = data.data
    } else {
      console.error("Fehler beim Laden der Posts")
    }
  }

  if (!account) {
    return (
      <main className="w-full flex justify-center">
        <Spinner className="fill-text w-10 h-10" />
      </main>
    )
  }

  return (
    <main className="max-w-md w-full mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-4">
            <ProfileImage src={account.account.profileImage} width={80} height={80} className="" alt={`Profilbild von ${account.account.username}`} />
            <h1 className="title text-3xl font-bold">{account.account.username}</h1>
          </div>
          {session && session.user.id === account.account._id && (
            <Link href="/einstellungen?page=2">
              <Icon path={mdiCogOutline} size={1} className="text-muted" />
            </Link>
          )}
        </div>
        <div>
          <p className="text text-muted text-sm">Beigetreten {CalcCreationDate(account.account.createdAt)}</p>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <p className="text text-xl font-semibold">
            {account.account.karma} Karma
          </p>
          <Popover>
            <PopoverTrigger><Icon path={mdiInformationOutline} size={0.8} className="text" /></PopoverTrigger>
            <PopoverContent>
              Karma kannst du durch Upvotes von Kommentaren und Posts sammeln die du erstellt hast.<br />Je mehr Upvotes, desto mehr Karma.<br /><br />Aber Vorsicht: Downvotes können auch Karma abziehen.
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator className="bg-muted my-6" />
      <ul className="flex flex-col gap-16">
        {account.posts.map((post) => (
          <li key={post._id}>
            <Post post={post} session={session} />
          </li>
        ))}
      </ul>
    </main>
  )
}