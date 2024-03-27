import { NextRequest, NextResponse } from "next/server";
import bigquery from "@/bigquery/client";

export async function GET(request: NextRequest) {

  

  // try {
  //   const snapshot = await firestore
  //     .collection("posts")
  //     .orderBy("created", "desc")
  //     .limit(10)
  //     .get();
  //   snapshot.forEach((doc: { id: string; data: Function }) => {
  //     // console.log(doc.id, "=>", doc.data());
  //     // data[doc.id] = doc.data();
  //     data.push(doc.data());
  //   });
  // } catch (err) {
  //   console.log(err);
  //   return NextResponse.json("Error, something went wrong", { status: 400 });
  // }

  return NextResponse.json({ status: 200 });
}
