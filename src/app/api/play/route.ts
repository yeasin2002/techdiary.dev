import { getComments } from "@/backend/services/comment.action";
import { NextResponse } from "next/server";

export async function GET() {
  const comments = await getComments({
    resource_id: "05553726-5168-41f3-b2d1-5d27cf5c8beb",
    resource_type: "ARTICLE",
  });

  return NextResponse.json(comments, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
