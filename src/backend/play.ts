import * as commentActions from "./services/comment.action";

async function main() {
  // Comment on a resource
  const newComment = await commentActions.createMyComment({
    body: "This is a comment on a resource",
    resource_id: "14fced36-31a7-42b3-9811-8887fc1331db",
    resource_type: "ARTICLE",
  });

  console.log(newComment);
}

main();
