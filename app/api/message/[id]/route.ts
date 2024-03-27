import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";

export async function GET(request: NextRequest) {
  let data = <any>[];

  try {
    const snapshot = await firestore
      .collection("posts")
      .where("userName", "==", request.cookies.get("session")?.value)
      .orderBy("created", "desc")
      .get();
    snapshot.forEach((doc: { id: string; data: Function }) => {
      // console.log(doc.id, "=>", doc.data());
      // data[doc.id] = doc.data();
      let temp = doc.data();
      temp.id = doc.id;
      data.push(temp);
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json(data, { status: 200 });
}
