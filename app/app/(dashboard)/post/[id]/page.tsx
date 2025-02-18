import { getSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Editor from "@/components/editor";
import db from "@/lib/db";

type PostPageParams = Promise<{ id: string }>;

export default async function PostPage(props: { params: PostPageParams }) {
  const params = await props.params;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const data = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, decodeURIComponent(params.id)),
    with: {
      site: {
        columns: {
          subdomain: true,
        },
      },
    },
  });
  if (!data || data.userId !== session.user.id) {
    notFound();
  }

  return <Editor post={data} />;
}
