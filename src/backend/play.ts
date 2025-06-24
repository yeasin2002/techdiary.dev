import { NextResponse } from "next/server";
import * as actions from "./services/article.actions";

async function main() {
  // Comment on a resource
  const res = await actions.updateMyArticle({
    article_id: "54603d22-1646-4ecd-a360-a8b9c8cd4889",
    title: "updated",
  });

  console.log(res);

  // return NextResponse.json(
  //   res.success ? res.data : { error: "something wrong" }
  // );
}

main();
