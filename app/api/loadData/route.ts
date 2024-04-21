import { NextRequest, NextResponse } from "next/server";
import {
  BatchWriteItemCommand,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { promises as fs } from "fs";
import {
  CreateTableCommand,
  DeleteTableCommand,
} from "@aws-sdk/client-dynamodb";
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Bucket, S3Bucket } from "@/s3Bucket/client";
import DynamoDB from "@/dynamoDB/client";

interface Song {
  title: string;
  artist: string;
  year: string
  web_url: string;
  img_url: string;
}

export async function GET(request: NextRequest) {
  const input = {
    AttributeDefinitions: [
      {
        AttributeName: "Title",
        AttributeType: "S",
      },
      {
        AttributeName: "Artist",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Title",
        KeyType: "HASH", //partition key
      },
      {
        AttributeName: "Artist",
        KeyType: "RANGE", //sort key
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    // BillingMode: "PAY_PER_REQUEST",
    TableName: "Music",
  };

  try {
    const command = new CreateTableCommand(input);
    const response = await DynamoDB.send(command);

    //upload images while table is being created
    const file = await fs.readFile(process.cwd() + "/a2.json", "utf8");
    const data = JSON.parse(file);
    let imageUrls: string[] = [];
    const songs: Song[] = data.songs;

    songs.forEach((song) => {
      if (!imageUrls.includes(song.img_url)) imageUrls.push(song.img_url);
      var filename = song.img_url.substring(song.img_url.lastIndexOf("/") + 1);
      song.img_url = "https://mybucket-s3683099.s3.amazonaws.com/" + filename;
    });

    await upload(imageUrls);

    const results = await waitUntilTableExists(
      { client: DynamoDB, maxWaitTime: 120 },
      { TableName: "Music" }
    );
    if (results.state == "SUCCESS") {
      const input1 = {
        RequestItems: {
          Music: [],
        },
      };

      let offset = 0;

      while (offset < data.songs.length) {
        const input1 = {
          RequestItems: {
            Music: [],
          },
        };
        const slice = data.songs.slice(offset, offset + 25);

        slice.forEach(
          (song: {
            title: string;
            artist: string;
            year: string;
            web_url: string;
            img_url: string;
          }) => {
            input1.RequestItems.Music.push({
              PutRequest: {
                Item: {
                  Title: {
                    S: song.title,
                  },
                  Artist: {
                    S: song.artist,
                  },
                  Year: {
                    S: song.year,
                  },
                  WebUrl: {
                    S: song.web_url,
                  },
                  ImgUrl: {
                    S: song.img_url,
                  },
                },
              },
            });
          }
        );

        const command1 = new BatchWriteItemCommand(input1);
        const response1 = await DynamoDB.send(command1);
        console.log(response1.$metadata.httpStatusCode);

        offset += 25;
      }

      return NextResponse.json(
        { message: response.TableDescription },
        { status: response.$metadata.httpStatusCode }
      );
    } else {
      console.error(`${results.state} ${results.reason}`);
      return NextResponse.json({ message: "Timeout" }, { status: 400 });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json("" + err, {
      status: 400,
    });
  }
}

// export async function PUT(request: NextRequest) {
//   try {
//     // downloadAttachment(
//     //   "https://raw.githubusercontent.com/davidpots/songnotes_cms/master/public/images/artists/TheTallestManOnEarth.jpg"
//     // );

//     const file = await fs.readFile(process.cwd() + "/a2.json", "utf8");
//     const data = JSON.parse(file);

//     let imageUrls: string[] = [];

//     const songs: Song[] = data.songs;

//     songs.forEach((song) => {
//       if (!imageUrls.includes(song.img_url)) imageUrls.push(song.img_url);
//     });

//     await upload(imageUrls);

//     const response = await S3Bucket.send(new ListObjectsCommand({ Bucket }));
//     return NextResponse.json(response?.Contents ?? []);
//     // return NextResponse.json({ message: "Success" }, { status: 200 });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json("" + err, {
//       status: 400,
//     });
//   }
// }

async function deleteImages() {
  // get the files
  const listCommand = new ListObjectsV2Command({ Bucket });
  let list = await S3Bucket.send(listCommand);
  if (list.KeyCount) {
    // if items to delete
    // delete the files
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: Bucket,
      Delete: {
        Objects: list.Contents.map((item) => ({ Key: item.Key })), // array of keys to be deleted
        Quiet: false, // provides info on successful deletes
      },
    });
    let deleted = await S3Bucket.send(deleteCommand); // delete the files
    // log any errors deleting files
    if (deleted.Errors) {
      deleted.Errors.map((error) =>
        console.log(`${error.Key} could not be deleted - ${error.Code}`)
      );
    }
    return `${deleted.Deleted.length} files deleted.`;
  }
}

export async function DELETE() {
  const input = {
    TableName: "Music",
  };

  try {
    const command = new DeleteTableCommand(input);
    const response = await DynamoDB.send(command);

    await deleteImages();

    return NextResponse.json(
      { message: response.TableDescription },
      { status: response.$metadata.httpStatusCode }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json("" + err, {
      status: 400,
    });
  }
}

async function upload(imageUrls: string[]) {
  const file = new FormData();

  console.log("Downloading images...");

  for (const imageUrl of imageUrls) {
    const result = await fetch(imageUrl, {
      method: "GET",
      headers: {},
    });
    const blob = await result.blob();

    var filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    file.append("file", blob, filename);
  }

  console.log("All images downloaded");

  const files = file.getAll("file") as File[];

  const response = await Promise.all(
    files.map(async (file) => {
      // not sure why I have to override the types here
      const Body = (await file.arrayBuffer()) as Buffer;
      S3Bucket.send(
        new PutObjectCommand({
          Bucket,
          Key: file.name,
          Body,
          ContentType: file.type,
        })
      );
    })
  );

  console.log("Images uploaded: " + imageUrls.length);
  return NextResponse.json(response);
}
