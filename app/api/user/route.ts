import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";

export async function GET(request: NextRequest) {
  let data: { [key: string]: any } = {};

  try {
    const snapshot = await firestore
      .collection("user")
      .orderBy("id", "desc")
      .get();
    snapshot.forEach((doc: { id: string; data: Function }) => {
      // console.log(doc.id, "=>", doc.data());
      data[doc.id] = doc.data();
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
