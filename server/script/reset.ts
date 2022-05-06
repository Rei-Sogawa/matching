import { getAuth, getDb, getStorage } from "./script-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const main = async () => {
  await Promise.all(["1988-04-10", "1989-06-03", "1991-09-15"].map((id) => auth.deleteUser(id)));
  const rootCollections = await db.listCollections();
  await Promise.all(rootCollections.map((collection) => db.recursiveDelete(collection)));
  await storage.bucket().deleteFiles({ prefix: "users" });
};

main();
