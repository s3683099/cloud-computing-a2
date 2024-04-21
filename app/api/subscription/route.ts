import DynamoDB from "@/dynamoDB/client";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { title }: { title: string } = await request.json();

  const email = request.cookies.get("email")?.value;

  console.log("email", email);
  console.log("title", title);

  try {
    const input = {
      Item: {
        email,
        title,
      },
      TableName: "Subscription",
    };
    const command = new PutCommand(input);
    const response = await DynamoDB.send(command);

    return NextResponse.json("Song Subscribed", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }
}
