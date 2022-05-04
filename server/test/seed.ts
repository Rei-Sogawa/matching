import { createCollections } from "../src/fire/create-collections";
import { UserData, UserDoc, UserStatDoc } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { getNow } from "../src/utils/get-now";
import { clearAuth, clearFirestore, getAuth, getDb, getStorage, id, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, userStatsCollection, allUsersStatsCollection } = collections;

const main = async () => {
  await clearAuth();
  await clearFirestore();

  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
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

  const allUsersStat = await allUsersStatsCollection.get();

  for (const fakeUser of fakeUsers) {
    await allUsersStat.signUp(fakeUser.id).set();

    const userStat = UserStatDoc.create(userStatsCollection.ref, { id: fakeUser.id });
    await userStat.set();
  }

  // NOTE: メインユーザー
  const cr7Auth = await auth.createUser({ email: "user-1@example.com", password: "password" });
  const cr7 = UserDoc.create(usersCollection.ref, { id: cr7Auth.uid });
  const cr7StoragePath = `users/${cr7.id}/profilePhotos/${id()}`;
  await storage.bucket().upload(__dirname + "/fixture/man-1.png", { destination: cr7StoragePath });
  await cr7.edit({ nickName: "CR7", photoPaths: [cr7StoragePath] }).set();
  await allUsersStat.signUp(cr7Auth.uid).set();

  const messiAuth = await auth.createUser({ email: "user-2@example.com", password: "password" });
  const messi = UserDoc.create(usersCollection.ref, { id: messiAuth.uid });
  const messiStoragePath = `users/${messi.id}/profilePhotos/${id()}`;
  await storage.bucket().upload(__dirname + "/fixture/man-2.png", { destination: messiStoragePath });
  await messi.edit({ nickName: "Messi", photoPaths: [messiStoragePath] }).set();
  await allUsersStat.signUp(messiAuth.uid).set();
};

main();
