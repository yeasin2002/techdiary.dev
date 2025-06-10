"use server";

import * as sessionActions from "@/backend/services/session.actions";
import { pgClient } from "@/backend/persistence/clients";

const sql = String.raw;

const query = sql`
SELECT (SELECT Count(*)
    FROM   articles
    WHERE  author_id = $1)
  AS total_articles,
  (SELECT Count(*)
    FROM   comments
    WHERE  comments.commentable_type = 'ARTICLE'
      AND  comments.commentable_id IN (SELECT id
                                        FROM   articles
                                        WHERE  articles.author_id = $1))
  AS total_comments
`;

export async function myArticleMatrix() {
  const sessionUserId = await sessionActions.getSessionUserId();

  const totalPostsQuery = await pgClient?.executeSQL<any>(query, [
    sessionUserId!,
  ]);

  return {
    total_articles: totalPostsQuery?.rows?.[0].total_articles,
    total_comments: totalPostsQuery?.rows?.[0].total_comments,
  };
}
