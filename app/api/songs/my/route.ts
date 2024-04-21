import DynamoDB from "@/dynamoDB/client";
import {
  DeleteCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

interface Song {
  title: string;
  artist: string;
  year: string;
  web_url: string;
  img_url: string;
}

export async function GET(request: NextRequest) {
  const email = request.cookies.get("email")?.value;
  console.log(email);

  let songs: Song[] = [];

  try {
    const input = {
      KeyConditionExpression: "email = :email",
      ProjectionExpression: "title",
      ExpressionAttributeValues: {
        ":email": email,
      },
      TableName: "Subscription",
    };
    const command = new QueryCommand(input);
    const response = await DynamoDB.send(command);
    console.log(response.Items);

    for (const item of response.Items!) {
      const input1 = {
        KeyConditionExpression: "Title = :title",
        ExpressionAttributeValues: {
          ":title": item.title,
        },
        TableName: "Music",
      };
      const command1 = new QueryCommand(input1);
      const response1 = await DynamoDB.send(command1);

      songs.push(response1.Items![0] as Song);
    }

    return NextResponse.json({ songs }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const { title }: { title: string } = await request.json();

  const email = request.cookies.get("email")?.value;
  console.log(email);

  try {
    const input = {
      Key: {
        email,
        title,
      },
      TableName: "Subscription",
    };
    const command = new DeleteCommand(input);
    const response = await DynamoDB.send(command);

    return NextResponse.json("Song removed from subscription", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }
}
