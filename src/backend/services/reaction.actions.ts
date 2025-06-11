"use server";

import z from "zod";
import { BookmarkActionInput } from "./inputs/bookmark.input";
import { authID } from "./session.actions";
import { ActionException, handleActionException } from "./RepositoryException";
import { persistenceRepository } from "../persistence/persistence-repositories";
import { and, eq } from "sqlkit";
import { ReactionActionInput } from "./inputs/reaction.input";

const sql = String.raw;

export async function toogleReaction(
  _input: z.infer<typeof ReactionActionInput.toggleReactionInput>
) {
  try {
    const sessionUserId = await authID();
    if (!sessionUserId) {
      throw new ActionException("Unauthorized");
    }
    const input =
      await ReactionActionInput.toggleReactionInput.parseAsync(_input);

    // -----------
    const [existingReaction] = await persistenceRepository.reaction.find({
      limit: 1,
      where: and(
        eq("resource_id", input.resource_id),
        eq("resource_type", input.resource_type),
        eq("user_id", sessionUserId)
      ),
    });

    if (existingReaction) {
      // If reaction exists, delete it
      await persistenceRepository.reaction.delete({
        where: and(
          eq("resource_id", input.resource_id),
          eq("resource_type", input.resource_type),
          eq("user_id", sessionUserId)
        ),
      });
      return {
        reaction_type: input.resource_type,
        resource_id: input.resource_id,
        reacted: false,
      };
    }

    // If reaction does not exist, create it
    await persistenceRepository.reaction.insert([
      {
        resource_id: input.resource_id,
        resource_type: input.resource_type,
        user_id: sessionUserId,
        created_at: new Date(),
      },
    ]);
    return {
      reaction_type: input.reaction_type,
      resource_id: input.resource_id,
      reacted: true,
    };
  } catch (error) {
    handleActionException(error);
  }
}

export async function getReactions(
  _input: z.infer<typeof ReactionActionInput.getReactionsInput>
) {
  try {
    const input =
      await ReactionActionInput.getReactionsInput.parseAsync(_input);
    const sessionUserId = await authID();

    const sql_query = sql`
      SELECT
          reaction_type,
          COUNT(DISTINCT user_id) AS count,
          ARRAY_AGG(DISTINCT user_id) AS reactor_user_ids
      FROM
          reactions
      WHERE
          resource_id = $1 AND
          resource_type = $2
      GROUP BY
          reaction_type;
    `;

    const response = await pgClient?.executeSQL(sql_query, [
      input.resource_id,
      input.resource_type,
    ]);

    return response?.rows?.map((row: any) => {
      return {
        reaction_type: row?.reaction_type! ?? null,
        count: Number(row?.count) ?? 0,
        is_reacted: row?.reactor_user_ids?.includes(sessionUserId) ?? false,
      };
    });
  } catch (error) {
    handleActionException(error);
  }
}
