import ContainerInner from "@/components/ContainerInner";
import Post from "@/components/post/Post";
import PostList from "@/components/post/PostList";
import BackendUrl from "@/components/utils/BackendUrl";
import Spinner from "@/components/utils/Spinner";
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
    }
  }


  if (!posts) {
    return (
      <ContainerInner>
        <main className="w-full flex justify-center">
          <Spinner className="fill-text w-10 h-10" />
        </main>
      </ContainerInner>
    )
  }

  return (
    <ContainerInner margin={false}>
      <main className="max-w-5xl w-full mx-auto h-screen">
        <PostList posts={posts} session={session} />
      </main>
    </ContainerInner>
  );
}