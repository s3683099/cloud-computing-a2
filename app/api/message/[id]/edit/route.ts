import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let data: any = {};

  try {
    const snapshot = await firestore.collection("posts").doc(params.id).get();
    data = snapshot.data();
    data.id = snapshot.id;
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  try {
    await firestore.collection("posts").doc(params.id).update({
      subject: body.subject,
      message: body.message,
      image: body.image,
      created: body.created,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json({ status: 200 });
}
