import { env } from "@/env";
import { Meilisearch } from "meilisearch";
import { and, eq, neq } from "sqlkit";
import { persistenceRepository } from "../persistence/persistence-repositories";

const meilisearchClient = new Meilisearch({
  host: env.MEILISEARCH_API_HOST,
  apiKey: env.MEILISEARCH_ADMIN_API_KEY,
});

const index = meilisearchClient.index("articles");
meilisearchClient
  .updateIndex("articles", {
    primaryKey: "id",
  })
  .then((res) => {
    console.log(`Index 'articles' created:`, res);
  })
  .catch((error) => {
    console.error("Error creating index 'articles':", error);
  });

export const syncAllArticles = async () => {
  try {
    const articles = await persistenceRepository.article.find({
      columns: ["id", "title", "body", "user", "cover_image"],
      where: and(eq("is_published", true), neq("approved_at", null)),
      joins: [
        {
          type: "left",
          table: "users",
          on: {
            localField: "author_id",
            foreignField: "id",
          },
          columns: ["id", "name", "username"],
        },
      ],
    });

    await index.addDocuments(articles, {
      primaryKey: "id",
    });

    return {
      message: "Articles synced successfully",
      count: articles.length,
      timestamp: new Date().toISOString(),
      index: "articles",
      environment: env.NODE_ENV,
    };
  } catch (error) {
    console.error("Error syncing articles:", error);
  }
};

export const syncArticleById = async (articleId: string) => {
  try {
    const [article] = await persistenceRepository.article.find({
      columns: ["id", "title", "body", "user", "cover_image"],
      limit: 1,
      where: and(
        eq("id", articleId),
        eq("is_published", true),
        neq("approved_at", null)
      ),
      joins: [
        {
          type: "left",
          table: "users",
          on: {
            localField: "author_id",
            foreignField: "id",
          },
          columns: ["id", "name", "username"],
        },
      ],
    });

    if (!article) {
      throw new Error(
        `Article with ID ${articleId} not found or not published.`
      );
    }

    await index.addDocuments([article], {
      primaryKey: "id",
    });

    return {
      message: `Article ${articleId} synced successfully`,
      article,
      timestamp: new Date().toISOString(),
      index: "articles",
      environment: env.NODE_ENV,
    };
  } catch (error) {
    console.error(`Error syncing article ${articleId}:`, error);
  }
};
export const deleteArticleById = async (articleId: string) => {
  try {
    const response = await index.deleteDocument(articleId);
    return {
      message: `Article ${articleId} deleted successfully`,
      response,
      timestamp: new Date().toISOString(),
      index: "articles",
      environment: env.NODE_ENV,
    };
  } catch (error) {
    console.error(`Error deleting article ${articleId}:`, error);
  }
};
