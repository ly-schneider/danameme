import BackButton from "@/components/post/BackButton";
import Comment from "@/components/comment/Comment";
import CommentForm from "@/components/comment/CommentForm";
import Post from "@/components/post/Post";
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
    title: `${post.title} - ${post.account.username} | Post | DANAMEME`,
  };
}

export default async function PostDetailPage({ params }) {
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
    <main className="flex flex-col max-w-md w-full mx-auto gap-8">
      <div>
        <BackButton />
      </div>
      <section>
        <Post post={post} session={session} />
      </section>
      <section>
        <CommentForm post={post} session={session} />
      </section>
      <section>
        <ul className="flex flex-col gap-10">
          {post.comments.map((comment) => (
            <li key={comment._id}>
              <Comment post={post} comment={comment} session={session} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}