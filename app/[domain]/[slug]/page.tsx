import { notFound } from "next/navigation";
import { getPostData, getSiteData } from "@/lib/fetchers";
import BlogCard from "@/components/blog-card";
import BlurImage from "@/components/blur-image";
import MDX from "@/components/mdx";
import { placeholderBlurhash, toDateString } from "@/lib/utils";
import db from "@/lib/db";
import { posts, sites } from "@/lib/schema";
import { eq } from "drizzle-orm";

type PageParams = Promise<{ domain: string; slug: string }>


export async function generateMetadata(props: {
  params: PageParams;
}) {
  const params = await props.params
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);

  const [data, siteData] = await Promise.all([
    getPostData(domain, slug),
    getSiteData(domain),
  ]);
  if (!data || !siteData) {
    return { title: "", description: "" };
  }
  const { title, description } = data;

  return {
    title,
    description,
    openGraph: {
      title: title ?? "",
      description: description ?? "",
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? "",
      description: description ?? "",
      creator: "@dynamick",
    },
    // Optional: Set canonical URL to custom domain if it exists
    // ...(params.domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) &&
    //   siteData.customDomain && {
    //     alternates: {
    //       canonical: `https://${siteData.customDomain}/${params.slug}`,
    //     },
    //   }),
  };
}

export async function generateStaticParams() {
  const allPosts = await db
    .select({
      slug: posts.slug,
      site: {
        subdomain: sites.subdomain,
        customDomain: sites.customDomain,
      },
    })
    .from(posts)
    .leftJoin(sites, eq(posts.siteId, sites.id))
    .where(eq(sites.subdomain, "demo")); // feel free to remove this filter if you want to generate paths for all posts

  return allPosts
    .flatMap(({site, slug}) => [
      site?.subdomain && {
        domain: `${site.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
        slug,
      },
      site?.customDomain && {
        domain: site.customDomain,
        slug,
      },
    ])
    .filter(Boolean);
}


export default async function SitePostPage(
  props: { params: PageParams }
) {
  const params = await props.params
  const domain = decodeURIComponent(params.domain);
  const slug = decodeURIComponent(params.slug);
  // const data = await getPostData(domain, slug);
  // if (!data) {
  //   notFound();
  // }
  // const data = {
  //   title: "Post Title",
  //   description: "Post Description",
  //   createdAt: new Date(),
  //   site: {
  //     user: {
  //       username: "dynamick",
  //       name: "Michael",
  //       image: "https://avatars.githubusercontent.com/u/4726921?v=4",
  //       gh_username: "dynamick",
  //     },
  //   },
  //   adjacentPosts: [],
  //   mdxSource: "",
  // }
  return (
    <>

      <div className="flex flex-col items-center justify-center">
        <div className="m-auto w-full text-center md:w-7/12">
          <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 md:text-base dark:text-stone-400">
            test1
          </p>
          <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 md:text-6xl dark:text-white">
            titolo
          </h1>
          <p className="text-md m-auto w-10/12 text-stone-600 md:text-lg dark:text-stone-400">
            descrizione
          </p>
        </div>
      </div>



      {/*<div className="flex flex-col items-center justify-center">*/}
      {/*  <div className="m-auto w-full text-center md:w-7/12">*/}
      {/*    <p className="m-auto my-5 w-10/12 text-sm font-light text-stone-500 md:text-base dark:text-stone-400">*/}
      {/*      {toDateString(data.createdAt)}*/}
      {/*    </p>*/}
      {/*    <h1 className="mb-10 font-title text-3xl font-bold text-stone-800 md:text-6xl dark:text-white">*/}
      {/*      {data.title}*/}
      {/*    </h1>*/}
      {/*    <p className="text-md m-auto w-10/12 text-stone-600 md:text-lg dark:text-stone-400">*/}
      {/*      {data.description}*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <a*/}
      {/*    // if you are using Github OAuth, you can get rid of the Twitter option*/}
      {/*    href={*/}
      {/*      data.site?.user?.username*/}
      {/*        ? `https://twitter.com/${data.site.user.username}`*/}
      {/*        : `https://github.com/${data.site?.user?.gh_username}`*/}
      {/*    }*/}
      {/*    rel="noreferrer"*/}
      {/*    target="_blank"*/}
      {/*  >*/}
      {/*    <div className="my-8">*/}
      {/*      <div className="relative inline-block h-8 w-8 overflow-hidden rounded-full align-middle md:h-12 md:w-12">*/}
      {/*        {data.site?.user?.image ? (*/}
      {/*          <BlurImage*/}
      {/*            alt={data.site?.user?.name ?? "User Avatar"}*/}
      {/*            height={80}*/}
      {/*            src={data.site.user.image}*/}
      {/*            width={80}*/}
      {/*          />*/}
      {/*        ) : (*/}
      {/*          <div className="absolute flex h-full w-full select-none items-center justify-center bg-stone-100 text-4xl text-stone-500">*/}
      {/*            ?*/}
      {/*          </div>*/}
      {/*        )}*/}
      {/*      </div>*/}
      {/*      <div className="text-md ml-3 inline-block align-middle md:text-lg dark:text-white">*/}
      {/*        by <span className="font-semibold">{data.site?.user?.name}</span>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </a>*/}
      {/*</div>*/}
      {/*<div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:mb-20 md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">*/}
      {/*  <BlurImage*/}
      {/*    alt={data.title ?? "Post image"}*/}
      {/*    width={1200}*/}
      {/*    height={630}*/}
      {/*    className="h-full w-full object-cover"*/}
      {/*    placeholder="blur"*/}
      {/*    blurDataURL={data.imageBlurhash ?? placeholderBlurhash}*/}
      {/*    src={data.image ?? "/placeholder.png"}*/}
      {/*  />*/}
      {/*</div>*/}

      {/*<MDX source={data.mdxSource} />*/}

      {/*{data.adjacentPosts.length > 0 && (*/}
      {/*  <div className="relative mb-20 mt-10 sm:mt-20">*/}
      {/*    <div*/}
      {/*      className="absolute inset-0 flex items-center"*/}
      {/*      aria-hidden="true"*/}
      {/*    >*/}
      {/*      <div className="w-full border-t border-stone-300 dark:border-stone-700" />*/}
      {/*    </div>*/}
      {/*    <div className="relative flex justify-center">*/}
      {/*      <span className="bg-white px-2 text-sm text-stone-500 dark:bg-black dark:text-stone-400">*/}
      {/*        Continue Reading*/}
      {/*      </span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*{data.adjacentPosts && (*/}
      {/*  <div className="mx-5 mb-20 grid max-w-screen-xl grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 xl:mx-auto xl:grid-cols-3">*/}
      {/*    {data.adjacentPosts.map((data: any, index: number) => (*/}
      {/*      <BlogCard key={index} data={data} />*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*)}*/}
    </>
  );
}
