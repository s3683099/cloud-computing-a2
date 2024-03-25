import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";
import storage from "@/storage/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const bucket = storage.bucket("cloud-computing-a1-s3683099.appspot.com");
  const file = bucket.file(params.id);
  const options = {
    expires: Date.now() + 1 * 60 * 1000, //  1 minute,
    fields: {
      "x-goog-meta-test": "data",
      bucket: "gs://cloud-computing-a1-s3683099.appspot.com",
    },
  };

  const [response] = await file.generateSignedPostPolicyV4(options);

  return NextResponse.json(response, { status: 200 });
}
