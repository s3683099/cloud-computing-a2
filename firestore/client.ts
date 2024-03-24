import { Firestore } from "@google-cloud/firestore";

const firestoreClientSingleton = () => {
  return new Firestore({
    projectId: "cloud-computing-a1-s3683099",
    databaseId: "cloud-computing-a1-db",
  });
};

declare global {
  var firestore: undefined | ReturnType<typeof firestoreClientSingleton>;
}

const firestore = globalThis.firestore ?? firestoreClientSingleton();

export default firestore;

if (process.env.NODE_ENV !== "production") globalThis.firestore = firestore;
