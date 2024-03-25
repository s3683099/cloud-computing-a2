import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";

export async function POST(request: NextRequest) {
  const body: { id: string; password: string } = await request.json();

  // console.log("id", body.id);
  // console.log("password", body.password);
  let imageUrl = "";
  let userName = "";

  try {
    const snapshot = await firestore
      .collection("user")
      .where("id", "==", body.id)
      .where("password", "==", body.password)
      .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return NextResponse.json("No matching documents.", {
        status: 400,
      });
    }
    snapshot.forEach((doc: { id: string; data: Function }) => {
      // console.log(doc.id, "=>", doc.data());
      imageUrl = doc.data().image;
      userName = doc.data().user_name;
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  const response = NextResponse.json({ message: "Welcome!" }, { status: 200 });
  response.cookies.set("session", userName);
  response.cookies.set("image", imageUrl);

  return response;
}
