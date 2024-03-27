import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";

export async function POST(request: NextRequest) {
  const body: {
    id: string;
    userName: string;
    password: string;
    image: string;
  } = await request.json();

  let tempId = false;
  let tempUsername = false;

  try {
    const snapshot = await firestore
      .collection("user")
      .where("id", "==", body.id)
      .get();
    if (snapshot.empty) {
      tempId = false;
    } else {
      tempId = true;
    }

    const snapshot1 = await firestore
      .collection("user")
      .where("user_name", "==", body.userName)
      .get();
    if (snapshot1.empty) {
      tempUsername = false;
    } else {
      tempUsername = true;
    }

    if (tempId && tempUsername) {
      return NextResponse.json(
        "The ID already exists && The username already exists",
        { status: 404 }
      );
    } else if (tempId) {
      return NextResponse.json("The ID already exists", { status: 404 });
    } else if (tempUsername) {
      return NextResponse.json("The username already exists", { status: 404 });
    }

    await firestore.collection("user").doc().set({
      id: body.id,
      user_name: body.userName,
      password: body.password,
      image: body.image,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json({ status: 200 });
}
