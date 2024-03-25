import { Storage } from "@google-cloud/storage";

const storageClientSingleton = () => {
  return new Storage();
};
declare global {
  var storage: undefined | ReturnType<typeof storageClientSingleton>;
}

const storage = globalThis.storage ?? storageClientSingleton();

export default storage;

if (process.env.NODE_ENV !== "production") globalThis.storage = storage;
