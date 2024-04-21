import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDBClientSingleton = () => {
  const dbClient = new DynamoDBClient({ region: "us-east-1" });
  const docClient = DynamoDBDocumentClient.from(dbClient);
  return docClient;
};

declare global {
  var DynamoDB: undefined | ReturnType<typeof dynamoDBClientSingleton>;
}

const DynamoDB = globalThis.DynamoDB ?? dynamoDBClientSingleton();

export default DynamoDB;

if (process.env.NODE_ENV !== "production") globalThis.DynamoDB = DynamoDB;
