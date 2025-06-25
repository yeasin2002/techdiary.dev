import HomeLeftSidebar from "@/app/(home)/_components/HomeLeftSidebar";
import { persistenceRepository } from "@/backend/persistence/persistence-repositories";
import * as articleActions from "@/backend/services/article.actions";
import AppImage from "@/components/AppImage";
import {
  CommentSection,
  CommentSectionProvider,
} from "@/components/comment-section";
import HomepageLayout from "@/components/layout/HomepageLayout";
import ResourceReaction from "@/components/ResourceReaction";
import { readingTime, removeMarkdownSyntax } from "@/lib/utils";
import getFileUrl from "@/utils/getFileUrl";
import { markdocParser } from "@/lib/markdown/markdoc-parser";
import { Metadata, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Article, WithContext } from "schema-dts";
import { eq } from "sqlkit";
import ArticleSidebar from "./_components/ArticleSidebar";
import ResourceBookmark from "@/components/ResourceBookmark";
import Markdown from "@/lib/markdown/Markdown";

interface ArticlePageProps {
  params: Promise<{
    username: string;
    articleHandle: string;
  }>;
}

export async function generateMetadata(
  options: ArticlePageProps
): Promise<Metadata> {
  // read route params
  const { articleHandle } = await options.params;
  const [article] = await persistenceRepository.article.find({
    where: eq("handle", articleHandle),
    columns: ["title", "excerpt", "cover_image", "body"],
    limit: 1,
  });

  if (!article.cover_image) {
    return {
      title: article.title,
      description: removeMarkdownSyntax(article.body ?? "", 20),
    };
  }

  return {
    title: article.title,
    description: removeMarkdownSyntax(
      article.excerpt ?? article.body ?? "",
      20
    ),
    openGraph: {
      url: `https://www.techdiary.dev/@${article.user?.username}/${article.handle}`,
      type: "article",
      images: [
        {
          url: getFileUrl(article.cover_image),
          alt: article.title,
        },
      ],
    },
  };
}

const Page: NextPage<ArticlePageProps> = async ({ params }) => {
  const _params = await params;
  const article = await articleActions.articleDetailByHandle(
    _params.articleHandle
  );

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: article?.title,
    image: getFileUrl(article?.cover_image),
    description: article?.excerpt ?? removeMarkdownSyntax(article?.body ?? ""),
    author: {
      "@type": "Person",
      name: article?.user?.name,
      image: getFileUrl(article?.user?.profile_photo),
      url: `https://www.techdiary.dev/@${article?.user?.username}`,
    },
    articleBody: removeMarkdownSyntax(article?.body ?? "", 300),
  };

  if (!article) {
    throw notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomepageLayout
        LeftSidebar={<HomeLeftSidebar />}
        RightSidebar={<ArticleSidebar article={article} />}
      >
        {/* {!article && <div>Article not found</div>} */}
        <div className="px-4 my-2 md:m-0">
          {article?.cover_image && (
            <div className="rounded-sm w-full overflow-hidden">
              <AppImage
                alt={article?.title ?? ""}
                imageSource={article?.cover_image}
                width={1200}
                height={630}
              />
            </div>
          )}

          {/* User information */}
          <div className="mb-4 flex items-center my-4">
            <div className="relative rounded-full overflow-hidden border transition-transform duration-300 size-10">
              <Image
                src={getFileUrl(article?.user?.profile_photo) ?? ""}
                alt={article?.user?.username ?? ""}
                width={40}
                height={40}
                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100"
              />
            </div>

            <div className="ml-2.5">
              <Link
                href={`/${article?.user?.username}`}
                className="text-md font-medium text-foreground"
              >
                {article?.user?.name}
              </Link>
              <div className="flex items-center text-xs text-muted-foreground">
                <time dateTime={article?.published_at?.toString()}>
                  {new Date(article?.published_at!).toLocaleDateString(
                    "bn-BD",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </time>
                <span className="mx-1.5">·</span>
                <span>
                  {readingTime(removeMarkdownSyntax(article?.body ?? "")!)} min
                  read
                </span>
              </div>
            </div>
          </div>

          <div className="my-6">
            <h1 className="text-2xl font-bold">{article?.title ?? ""}</h1>
          </div>

          <div className="flex items-center justify-between mb-4">
            <ResourceReaction
              resource_type="ARTICLE"
              resource_id={article.id}
            />
            <ResourceBookmark
              resource_type="ARTICLE"
              resource_id={article.id}
            />
          </div>

          <div className="mx-auto content-typography">
            {article.body && <Markdown content={article.body!} />}
          </div>
        </div>

        <CommentSectionProvider>
          <CommentSection resource_type="ARTICLE" resource_id={article.id} />
        </CommentSectionProvider>
      </HomepageLayout>
    </>
  );
};

export default Page;
