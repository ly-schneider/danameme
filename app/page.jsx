import Post from "@/components/post/Post";
import BackendUrl from "@/components/utils/BackendUrl";
import { getSession } from "@/lib/Session";

export async function generateMetadata() {
  return {
    title: "Home | DANAMEME",
  };
}

export default async function HomePage() {
  const session = await getSession();

  let posts = null;

  if (session) {
    const res = await fetch(`${BackendUrl()}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!res.ok || res.status !== 200) {
      console.error("Fehler beim Laden der Posts")
      return
    }

    const data = await res.json()

    if (data.success) {
      posts = data.data
    } else {
      console.error("Fehler beim Laden der Posts")
      return
    }
  }


  if (!posts) {
    return (
      <main>
        <h1>Laden...</h1>
      </main>
    )
  }

  return (
    <main className="max-w-md w-full mx-auto">
      <ul className="flex flex-col gap-16">
        {posts.map((post) => (
          <li key={post._id}>
            <Post post={post} session={session} />
          </li>
        ))}
      </ul>
    </main>
  );
}