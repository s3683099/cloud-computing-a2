import { S3Client } from "@aws-sdk/client-s3";

const Bucket = "mybucket-s3683099";

const s3ClientSingleton = () => {
  const S3Bucket = new S3Client({
    region: "us-east-1",
  });

  return S3Bucket;
};

declare global {
  var S3Bucket: undefined | ReturnType<typeof s3ClientSingleton>;
}

const S3Bucket = globalThis.S3Bucket ?? s3ClientSingleton();

export { S3Bucket, Bucket };

if (process.env.NODE_ENV !== "production") globalThis.S3Bucket = S3Bucket;
