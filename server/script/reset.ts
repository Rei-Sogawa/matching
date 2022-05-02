import { createCollections } from "../src/fire/create-collections";
import { getAuth, getDb, getStorage } from "./script-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection } = collections;

const main = async () => {
  const users = await usersCollection.findManyByQuery((ref) => ref);
  await auth.deleteUsers(users.map((user) => user.id));
  const rootCollections = await db.listCollections();
  await Promise.all(rootCollections.map((collection) => db.recursiveDelete(collection)));
  await storage.bucket().deleteFiles({ prefix: "users" });
};

main();
