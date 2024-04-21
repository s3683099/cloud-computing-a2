import DynamoDB from "@/dynamoDB/client";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: { email: string; password: string } = await request.json();

  console.log("email", body.email);
  console.log("password", body.password);

  let userName = "";

  try {
    const command = new QueryCommand({
      TableName: "login",
      KeyConditionExpression: "email = :email",
      FilterExpression: "password = :password",
      ExpressionAttributeValues: {
        ":email": body.email,
        ":password": body.password,
      },
    });

    const response = await DynamoDB.send(command);

    if (response.Items?.length! == 0) {
      return NextResponse.json("Email or password is invalid", {
        status: 400,
      });
    }
    userName = response.Items![0].user_name;
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }

  const response = NextResponse.json({ message: "Welcome!" }, { status: 200 });
  response.cookies.set("session", userName);

  return response;
}
