import PostForm from "@/components/post/PostForm";
import BackendUrl from "@/components/utils/BackendUrl";
import { getSession } from "@/lib/Session";

export async function generateMetadata({ params }) {
  const session = await getSession();

  let post = null;

  if (session) {
    const res = await fetch(`${BackendUrl()}/posts/id/${params.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!res.ok || res.status !== 200) {
      console.error("Fehler beim Laden des Posts")
      return
    }

    const data = await res.json()

    if (data.success) {
      post = data.data
    } else {
      console.error("Fehler beim Laden des Posts")
      return
    }
  }

  return {
    title: `${post.title} | Bearbeiten | DANAMEME`,
  };
}

export default async function PostPage({ params }) {
  const session = await getSession();

  let post = null;

  if (session) {
    const res = await fetch(`${BackendUrl()}/posts/id/${params.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!res.ok || res.status !== 200) {
      console.error("Fehler beim Laden des Posts")
      return
    }

    const data = await res.json()

    if (data.success) {
      post = data.data
    } else {
      console.error("Fehler beim Laden des Posts")
      return
    }
  }

  if (!post) {
    return (
      <main>
        <h1>Laden...</h1>
      </main>
    )
  }

  return (
    <main className="mt-12">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <h1 className="title">Post bearbeiten</h1>
        <PostForm post={post} session={session} />
      </section>
    </main>
  );
}