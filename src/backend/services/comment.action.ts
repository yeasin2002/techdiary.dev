import z from "zod";
import { CommentActionInput } from "./inputs/comment.input";

export const getComments = async (
  resourceId: string,
  resourceType: "ARTICLE" | "COMMENT"
) => {
  // Fetch comments from the database based on resourceId and resourceType
  // const comments = await db
  //   .select()
  //   .from(commentsTable)
  //   .where(commentsTable.resource_id.eq(resourceId))
  //   .and(commentsTable.resource_type.eq(resourceType))
  //   .orderBy(commentsTable.created_at.desc());
  // return comments;
  return []; // Placeholder for actual database query
};

export const createComment = async (
  input: z.infer<typeof CommentActionInput.create>
) => {
  const { resource_id, resource_type, body } = input;

  // Create the comment in the database

  // return newComment[0];
};

export const deleteComment = async (
  input: z.infer<typeof CommentActionInput.delete>
) => {
  const { id } = input;

  // Delete the comment from the database
  // await db.delete(commentsTable).where(commentsTable.id.eq(id));

  // return { success: true };
};
