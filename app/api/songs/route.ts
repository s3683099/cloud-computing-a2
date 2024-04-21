import DynamoDB from "@/dynamoDB/client";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: { title: string; year: string; artist: string } =
    await request.json();

  console.log("body", body);

  try {
    const command = new QueryCommand({
      TableName: "Music",
      KeyConditionExpression: "Title = :title AND Artist = :artist",
      FilterExpression: "#y = :year",
      ExpressionAttributeValues: {
        ":title": body.title,
        ":artist": body.artist,
        ":year": body.year,
      },
      ExpressionAttributeNames: {
        "#y": "Year",
      },
    });

    const response = await DynamoDB.send(command);

    return NextResponse.json({ songs: response.Items }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }
}
