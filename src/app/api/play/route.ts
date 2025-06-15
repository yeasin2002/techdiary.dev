import { myBookmarks } from "@/backend/services/bookmark.action";
import { NextResponse } from "next/server";

export async function GET() {
  const bookmarks = await myBookmarks({
    resource_type: "ARTICLE",
  });

  return NextResponse.json(bookmarks, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
