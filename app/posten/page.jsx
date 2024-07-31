import PostForm from "@/components/PostForm";
import { getSession } from "@/lib/Session";

export async function generateMetadata() {
  return {
    title: "Neuen Post erstellen | DANAMEME",
  };
}

export default async function PostPage() {
  const session = await getSession();

  return (
    <main className="mt-12">
      <section className="flex flex-col max-w-md w-full mx-auto">
        <h1 className="title">Post erstellen</h1>
        <PostForm session={session} />
      </section>
    </main>
  );
}