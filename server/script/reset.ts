import { getDb, getStorage } from "./script-utils";

const db = getDb();
const storage = getStorage();

const main = async () => {
  const rootCollections = await db.listCollections();
  await Promise.all(rootCollections.map((collection) => db.recursiveDelete(collection)));
  await storage.bucket().deleteFiles({ prefix: "users" });
};

main();
