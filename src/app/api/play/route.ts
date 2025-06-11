import { NextResponse } from "next/server";
import * as reactionActions from "@/backend/services/reaction.actions";

export async function GET() {
  const response = await reactionActions.getResourceReactions({
    resource_id: "00e2ed46-b113-4f4f-899f-ae8477ecd5a4",
    resource_type: "ARTICLE",
  });

  return NextResponse.json(response, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
