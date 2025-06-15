"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { myBookmarks } from "@/backend/services/bookmark.action";
import ArticleCard from "@/components/ArticleCard";
import VisibilitySensor from "@/components/VisibilitySensor";

interface BookmarkMeta {
  totalCount: number;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
}

interface BookmarkData {
  nodes: any[];
  meta: BookmarkMeta;
}

const BookmarksPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<BookmarkData>({
    queryKey: ["bookmarks"],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await myBookmarks({
        page: pageParam as number,
        limit: 10,
        offset: 0,
      });
      return result as BookmarkData;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.hasNextPage
        ? lastPage.meta.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const bookmarks = data?.pages.flatMap((page) => page?.nodes || []) || [];
  const totalCount = data?.pages[0]?.meta?.totalCount || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold">My Bookmarks</h1>
          <p className="text-muted-foreground mt-1">
            Articles you've saved for later
          </p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-2">⚠️ Error</div>
        <p className="text-muted-foreground">Failed to load bookmarks</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold">My Bookmarks</h1>
          <p className="text-muted-foreground mt-1">
            Articles you've saved for later
          </p>
        </div>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-medium mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground mb-6">
            Start bookmarking articles to see them here
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Explore Articles
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">My Bookmarks</h1>
        <p className="text-muted-foreground mt-1">
          {totalCount} article{totalCount !== 1 ? "s" : ""} saved
        </p>
      </div>

      <div className="space-y-6">
        {bookmarks.map((bookmark) => (
          <ArticleCard
            key={bookmark.id}
            id={bookmark.article.id}
            title={bookmark.article.title}
            excerpt=""
            coverImage={bookmark.article.cover_image}
            publishedAt={bookmark.created_at}
            readingTime={5}
            author={bookmark.article.author}
            handle={""}
            likes={0}
            comments={0}
          />
        ))}
      </div>

      {/* {hasNextPage && <VisibilitySensor loading={isFetchingNextPage} />} */}
    </div>
  );
};

export default BookmarksPage;
