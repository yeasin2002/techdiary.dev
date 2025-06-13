import { NextResponse } from "next/server";
// import * as reactionActions from "@/backend/services/reaction.actions";
import * as searchService from "@/backend/services/search.service";

export async function GET() {
  const response = await searchService.syncAllArticles();

  return NextResponse.json(response, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
