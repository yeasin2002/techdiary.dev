import { z } from "zod";

export const BookmarkActionInput = {
  toggleBookmarkInput: z.object({
    resource_id: z.string(),
    resource_type: z.enum(["ARTICLE", "COMMENT"]),
  }),
  myBookmarks: z.object({
    resource_type: z.enum(["ARTICLE", "COMMENT"]).optional(),
  }),
  bookmarkStatusInput: z.object({
    resource_id: z.string(),
    resource_type: z.enum(["ARTICLE", "COMMENT"]),
  }),
};
