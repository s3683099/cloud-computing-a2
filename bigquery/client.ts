import { BigQuery } from "@google-cloud/bigquery";

const bigqueryClientSingleton = () => {
  return new Storage();
};
declare global {
  var bigquery: undefined | ReturnType<typeof bigqueryClientSingleton>;
}

const bigquery = globalThis.bigquery ?? bigqueryClientSingleton();

export default bigquery;

if (process.env.NODE_ENV !== "production") globalThis.bigquery = bigquery;
