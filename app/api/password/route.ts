import { NextRequest, NextResponse } from "next/server";
import firestore from "@/firestore/client";

export async function POST(request: NextRequest) {
  const body: { oldPassword: string; newPassword: string } =
    await request.json();

  try {
    const snapshot = await firestore
      .collection("user")
      .where("user_name", "==", request.cookies.get("session")?.value)
      .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return NextResponse.json("No matching documents.", {
        status: 400,
      });
    }
    let userId = "";
    let passwordMatch = false;
    snapshot.forEach((doc: { id: string; data: Function }) => {
      userId = doc.id;
      const data = doc.data();
      if (data.password == body.oldPassword) {
        passwordMatch = true;
      }
    });

    if (!passwordMatch) {
      return NextResponse.json("Old Password is incorrect", {
        status: 400,
      });
    }

    await firestore.collection("user").doc(userId).update({
      password: body.newPassword,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  // const response = NextResponse.json({ message: "Welcome!" }, { status: 200 });
  // response.cookies.set("session", userName);
  // response.cookies.set("image", imageUrl);

  return NextResponse.json({ status: 200 });
}
