import { NextRequest, NextResponse } from "next/server";
import DynamoDB from "@/dynamoDB/client";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request: NextRequest) {
  const body: {
    email: string;
    userName: string;
    password: string;
    image: string;
  } = await request.json();

  try {
    const command = new QueryCommand({
      TableName: "login",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": body.email,
      },
    });

    const response = await DynamoDB.send(command);

    if (response.Items?.length! > 0) {
      return NextResponse.json("The email already exists", { status: 404 });
    }

    await DynamoDB.send(
      new PutCommand({
        TableName: "login",
        Item: {
          email: body.email,
          user_name: body.userName,
          password: body.password,
        },
      })
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  return NextResponse.json({ status: 200 });
}
