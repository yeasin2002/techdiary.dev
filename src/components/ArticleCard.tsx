"use client";

import { useTranslation } from "@/i18n/use-translation";
import { formattedTime } from "@/lib/utils";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ResourceBookmarkable } from "./render-props/ResourceBookmarkable";
import { ResourceReactionable } from "./render-props/ResourceReactionable";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import UserInformationCard from "./UserInformationCard";
import { useLoginPopup } from "./app-login-popup";
import { useSession } from "@/store/session.atom";
import ResourceReaction from "./ResourceReaction";

interface ArticleCardProps {
  id: string;
  title: string;
  handle: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  publishedAt: string;
  readingTime: number;
  likes: number;
  comments: number;
}

const ArticleCard = ({
  id,
  title,
  handle,
  excerpt,
  coverImage,
  author,
  publishedAt,
  readingTime,
  likes,
  comments,
}: ArticleCardProps) => {
  const { lang } = useTranslation();
  const session = useSession();
  const loginPopup = useLoginPopup();

  const articleUrl = useMemo(() => {
    return `/@${author.username}/${handle}`;
  }, [author.username, handle]);

  return (
    <div data-article-id={id} className="flex flex-col p-4 sm:p-5 group">
      <HoverCard>
        <HoverCardTrigger>
          <div className="mb-4 flex items-center">
            <div className="relative rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 transition-transform duration-300 size-8 opacity-100">
              <Image
                width={32}
                height={32}
                unoptimized
                src={author.avatar ?? ""}
                alt={author.name ?? ""}
                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-100"
              />
            </div>
            <div className="ml-2.5">
              <Link
                href={`/@${author.username}`}
                className="text-sm font-medium text-foreground"
              >
                {author.name}
              </Link>
              <div className="flex items-center text-xs text-muted-foreground">
                <time dateTime={publishedAt}>
                  {formattedTime(new Date(publishedAt), lang)}
                </time>
                <span className="mx-1.5">·</span>
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent align="start">
          <UserInformationCard userId={author.id} />
        </HoverCardContent>
      </HoverCard>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col space-y-2 mb-3">
          <Link
            href={articleUrl}
            className="text-lg font-bold text-foreground group-hover:text-primary group-hover:underline transition-colors duration-200"
          >
            {title}...
          </Link>
          <p className="text-sm text-muted-foreground">
            {excerpt} [<Link href={articleUrl}>Read more</Link>]
          </p>
        </div>

        {coverImage && (
          <Link href={articleUrl} className="block">
            <div className="relative mt-4 overflow-hidden rounded-md aspect-[16/9]">
              <Image
                src={coverImage}
                alt={title}
                width={1200}
                height={630}
                className="h-full w-full object-cover transition-all duration-700 opacity-100 scale-100"
              />
            </div>
          </Link>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <ResourceReaction resource_type="ARTICLE" resource_id={id} />

        <ResourceBookmarkable
          resource_type="ARTICLE"
          resource_id={id}
          render={({ bookmarked, toggle }) => (
            <button
              onClick={() => {
                if (!session?.user) {
                  loginPopup.show();
                  return;
                }
                toggle();
              }}
              className={clsx(
                "transition-colors duration-300 flex cursor-pointer px-2 py-1 rounded-sm hover:bg-primary/20",
                { "bg-primary/20": bookmarked }
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={clsx("size-5 stroke-2 fill-transparent", {
                  "!stroke-current": !bookmarked,
                  "!fill-current": bookmarked,
                })}
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
            </button>
          )}
        />
      </div>
    </div>
  );
};

export default ArticleCard;
