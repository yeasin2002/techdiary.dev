import z from "zod";
import { BookmarkActionInput } from "./inputs/bookmark.input";
import { authID } from "./session.actions";
import { ActionException, handleActionException } from "./RepositoryException";
import { persistenceRepository } from "../persistence/persistence-repositories";
import { and, eq } from "sqlkit";

export async function toggleResourceBookmark(
  _input: z.infer<typeof BookmarkActionInput.toggleBookmarkInput>
) {
  try {
    const sessionUserId = await authID();
    if (!sessionUserId) {
      throw new ActionException("Unauthorized");
    }
    const input =
      await BookmarkActionInput.toggleBookmarkInput.parseAsync(_input);

    // -----------
    const [existingBookmark] = await persistenceRepository.bookmark.find({
      limit: 1,
      where: and(
        eq("resource_id", input.resource_id),
        eq("resource_type", input.resource_type),
        eq("user_id", sessionUserId)
      ),
    });

    if (existingBookmark) {
      // If bookmark exists, delete it
      await persistenceRepository.bookmark.delete({
        where: and(
          eq("resource_id", input.resource_id),
          eq("resource_type", input.resource_type),
          eq("user_id", sessionUserId)
        ),
      });
      return { bookmarked: false };
    }

    // If bookmark does not exist, create it
    await persistenceRepository.bookmark.insert([
      {
        resource_id: input.resource_id,
        resource_type: input.resource_type,
        user_id: sessionUserId,
      },
    ]);
    return { bookmarked: true };
  } catch (error) {
    handleActionException(error);
  }
}
