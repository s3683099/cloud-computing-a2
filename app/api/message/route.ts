import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: {
    subject: string;
    message: string;
    image: string;
    created: Date;
  } = await request.json();

  try {
    const docRef = firestore.collection("posts").doc();
    await docRef.set({
      subject: body.subject,
      message: body.message,
      image: body.image,
      userName: request.cookies.get("session")?.value,
      profileImage: request.cookies.get("image")?.value,
      created: body.created,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json({ status: 200 });
}

export async function GET(request: NextRequest) {
  let data = <any>[];

  try {
    const snapshot = await firestore
      .collection("posts")
      .orderBy("created", "desc")
      .limit(10)
      .get();
    snapshot.forEach((doc: { id: string; data: Function }) => {
      // console.log(doc.id, "=>", doc.data());
      // data[doc.id] = doc.data();
      data.push(doc.data());
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
