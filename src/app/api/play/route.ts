import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { play: true },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
