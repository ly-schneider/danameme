import BackendUrl from "@/components/utils/BackendUrl";
import { getSession } from "@/lib/Session";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: "Profil | DANAMEME",
  };
}

export default async function ProfilePage() {
  const session = await getSession();

  if (session) {
    const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}`, {
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
      redirect(`/profil/${data.data.username}`)
    } else {
      console.error("Fehler beim Laden der Posts")
      return
    }
  }
}