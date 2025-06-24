import { updateMyArticle } from "@/backend/services/article.actions";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { res: 1 },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
