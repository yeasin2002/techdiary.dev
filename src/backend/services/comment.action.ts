import z from "zod";
import { CommentActionInput } from "./inputs/comment.input";
import { authID } from "./session.actions";
import { ActionException } from "./RepositoryException";
import { persistenceRepository } from "../persistence/persistence-repositories";
import { eq } from "sqlkit";

const sql = String.raw;

export const getComments = async (
  _input: z.infer<typeof CommentActionInput.getComments>
) => {
  const input = CommentActionInput.getComments.parse(_input);

  const query = sql`
    WITH RECURSIVE comment_tree AS (
        -- Root comments
        SELECT 
            id, body, user_id, created_at, resource_id, resource_type,
            0 as level,
            id as root_id
        FROM comments 
        WHERE resource_id = $1 
          AND resource_type = $2
        
        UNION ALL
        
        -- Nested replies (up to level 3)
        SELECT 
            c.id, c.body, c.user_id, c.created_at, c.resource_id, c.resource_type,
            ct.level + 1,
            ct.root_id
        FROM comments c
        JOIN comment_tree ct ON c.resource_id = ct.id
        WHERE c.resource_type = 'COMMENT'
          AND ct.level < 3  -- This allows up to level 3 (0, 1, 2, 3)
    ),
    -- Function to build replies recursively
    build_replies(parent_id, max_level) AS (
        SELECT 
            ct.resource_id as parent_id,
            3 as max_level,
            json_agg(
                json_build_object(
                    'id', ct.id,
                    'body', ct.body,
                    'level', ct.level,
                    'created_at', ct.created_at,
                    'parent_id', ct.resource_id,
                    'author', json_build_object(
                        'name', u.name,
                        'email', u.email
                    ),
                    'replies', CASE 
                        WHEN ct.level < 3 THEN 
                            COALESCE(
                                (SELECT json_agg(child_reply ORDER BY (child_reply->>'created_at')::timestamp)
                                FROM build_replies(ct.id, 3) br
                                CROSS JOIN json_array_elements(br.replies) as child_reply),
                                '[]'::json
                            )
                        ELSE '[]'::json
                    END
                ) ORDER BY ct.created_at
            ) as replies
        FROM comment_tree ct
        JOIN users u ON ct.user_id = u.id
        WHERE ct.resource_id = parent_id AND ct.level > 0
        GROUP BY ct.resource_id
    )
    SELECT json_agg(
        json_build_object(
            'id', ct.id,
            'body', ct.body,
            'level', ct.level,
            'created_at', ct.created_at,
            'parent_id', null,
            'author', json_build_object(
                'name', u.name,
                'email', u.email
            ),
            'replies', COALESCE(br.replies, '[]'::json)
        ) ORDER BY ct.created_at
    ) as comments
    FROM comment_tree ct
    JOIN users u ON ct.user_id = u.id
    LEFT JOIN build_replies(ct.id, 3) br ON true
    WHERE ct.level = 0;
  `;

  const comments = await pgClient?.executeSQL(query, [
    input.resource_id,
    input.resource_type,
  ]);
  return comments?.rows?.[0]; // Placeholder for actual database query
};

export const createMyComment = async (
  input: z.infer<typeof CommentActionInput.create>
) => {
  const sessionId = await authID();
  if (!sessionId) {
    throw new ActionException("Unauthorized: No session ID found");
  }
  const { resource_id, resource_type, body } = input;

  switch (resource_type) {
    case "ARTICLE":
      // Validate that the resource exists
      const [exists] = await persistenceRepository.article.find({
        where: eq("id", resource_id),
        limit: 1,
        columns: ["id"],
      });
      if (!exists) {
        throw new ActionException("Resource not found");
      }
      break;
    case "COMMENT":
      // Validate that the parent comment exists
      const [parentExists] = await persistenceRepository.comment.find({
        where: eq("id", resource_id),
        limit: 1,
        columns: ["id"],
      });
      if (!parentExists) {
        throw new ActionException("Parent comment not found");
      }
      break;
    default:
      throw new ActionException("Invalid resource type");
  }

  const created = await persistenceRepository.comment.insert([
    {
      body,
      resource_id,
      resource_type,
      user_id: sessionId,
    },
  ]);

  return created?.rows?.[0];
};

export const deleteComment = async (
  input: z.infer<typeof CommentActionInput.delete>
) => {
  const { id } = input;

  // Delete the comment from the database
  // await db.delete(commentsTable).where(commentsTable.id.eq(id));

  // return { success: true };
};
