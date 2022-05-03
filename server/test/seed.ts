import { createCollections } from "../src/fire/create-collections";
import { UserData } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { getNow } from "../src/utils/get-now";
import { clearAuth, clearFirestore, getAuth, getDb, getStorage, id, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, allUsersStatsCollection } = collections;

const main = async () => {
  await clearAuth();
  await clearFirestore();

  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 25 }).map((_, i) => {
      return { uid: id(), email: `fake-user-${i}@example.com`, password: "password" };
    })
  );

  const fakeUsers = await Promise.all(
    fakeAuthUsers.map((authUser, i) => {
      const createdAt = getNow();
      const userData: UserData = {
        gender: ["MALE", "FEMALE"][randomInt(1)] as "MALE" | "FEMALE",
        nickName: `fake-user-${i}`,
        age: randomInt(65, 18),
        livingPref: prefs[randomInt(46)],
        photoPaths: [`https://i.pravatar.cc/?img=${i}`], // NOTE: img は 70 まで
        createdAt,
        updatedAt: createdAt,
      };
      return usersCollection.insert({ id: authUser.uid, ...userData });
    })
  );

  for (const fakeUser of fakeUsers) {
    await allUsersStatsCollection.merge({ userIds: [fakeUser.id] });
  }

  // NOTE: メインユーザー
  const authUser = await auth.createUser({ email: "user-1@example.com", password: "password" });
  const user = await usersCollection.create(authUser.uid);
  const storagePath = `users/${authUser.uid}/profilePhotos/${id()}`;
  await storage.bucket().upload(__dirname + "/fixture/man-1.png", { destination: storagePath });
  await user.edit({ photoPaths: [storagePath] }).update();

  await allUsersStatsCollection.merge({ userIds: [authUser.uid] });
};

main();
