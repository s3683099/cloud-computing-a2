import DynamoDB from "@/dynamoDB/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

interface Song {
  title: string;
  artist: string;
  year: string;
  web_url: string;
  img_url: string;
}

export async function POST(request: NextRequest) {
  const {
    title,
    year,
    artist,
  }: { title: string; year: string; artist: string } = await request.json();

  console.log("title", title);
  console.log("year", year);
  console.log("artist", artist);

  // const file = await fs.readFile(process.cwd() + "/a2.json", "utf8");
  // const data = JSON.parse(file);
  // let titles: string[] = [];
  // const songs: Song[] = data.songs;

  // songs.forEach((song) => {
  //   if (!titles.includes(song.year)) titles.push(song.year);
  // });
  // console.log("Unique title count", titles.length);
  type Org = { [key: string]: string } | undefined;

  try {
    let filterExpression = undefined;
    let expressionAttributeValues: Org = undefined;
    let expressionAttributeNames = undefined;

    if (title != "") {
      filterExpression = "Title = :title";
      expressionAttributeValues = { ":title": title };
    }
    if (artist != "") {
      if (filterExpression) {
        filterExpression += " AND Artist = :artist";
        expressionAttributeValues![":artist"] = artist;
      } else {
        filterExpression = "Artist = :artist";
        expressionAttributeValues = { ":artist": artist };
      }
    }
    if (year != "") {
      if (filterExpression) {
        filterExpression += "  AND #y = :year";
        expressionAttributeValues![":year"] = year;
      } else {
        filterExpression = "#y = :year";
        expressionAttributeValues = { ":year": year };
      }
      expressionAttributeNames = { "#y": "Year" };
    }

    let option = {
      TableName: "Music",
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
    };

    console.log(option);

    const command = new ScanCommand(option);

    const response = await DynamoDB.send(command);

    console.log(response.Items?.length);

    return NextResponse.json({ songs: response.Items }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("Error, something went wrong", { status: 400 });
  }
}
