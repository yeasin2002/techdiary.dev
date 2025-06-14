import { getComments } from "@/backend/services/comment.action";
import { NextResponse } from "next/server";

export async function GET() {
  const comments = await getComments({
    resource_id: "16196e73-275a-4af5-9186-39a5fec4244e",
    resource_type: "ARTICLE",
  });

  return NextResponse.json(comments, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
