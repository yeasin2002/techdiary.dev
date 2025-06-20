import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Pool } from "pg";

export const s3Client = new S3Client({
  endpoint: Deno.env.get("S3_ENDPOINT")!,
  region: Deno.env.get("S3_REGION")!,
  credentials: {
    accessKeyId: Deno.env.get("S3_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("S3_ACCESS_SECRET")!,
  },
});

const pool = new Pool({
  connectionString: Deno.env.get("DATABASE_URL")!,
});

try {
  const startTime = performance.now();
  const result = await pool.query(
    "select * from users where profile_photo_url is not null"
  );

  await Promise.all(
    result.rows?.map(async (user) => {
      const file = await urlToS3(user.profile_photo_url, user.id);
      // console.log({ file, user: user.id });
      await pool.query(`update users set profile_photo= $1 where id = $2`, [
        JSON.stringify({ provider: "r2", key: file.key }),
        user.id,
      ]);
    })
  );

  const endTime = performance.now();

  console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);
} catch (err) {
  console.error("Something went wrong:", err);
}

async function urlToS3(url: string, key: string) {
  const api = await fetch(url);
  const body = await api.bytes();
  // const blob = await api.blob();
  const command = new PutObjectCommand({
    Bucket: Deno.env.get("S3_BUCKET")!,
    Key: `user-avatars/${key}.jpg`,
    ContentType: "image/jpg",
    Body: body,
  });

  await s3Client.send(command);
  return {
    provider: "r2",
    key: `user-avatars/${key}.jpg`,
  };
}
