import { createCollections } from "../src/fire/create-collections";
import { UserDoc, UserStatDoc } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { clearAuth, clearFirestore, getAuth, getDb, getStorage, id, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, userStatsCollection, allUsersStatsCollection } = collections;

const main = async () => {
  await clearAuth();
  await clearFirestore();

  const allUsersStat = await allUsersStatsCollection.get();

  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
      return { uid: id(), email: `fake-user-${i}@example.com`, password: "password" };
    })
  );

  let i = 0;
  for (const fakeAuthUser of fakeAuthUsers) {
    const user = UserDoc.create(usersCollection.ref, { id: fakeAuthUser.uid });
    const userStat = UserStatDoc.create(userStatsCollection.ref, { id: fakeAuthUser.uid });

    await user
      .edit({
        gender: ["MALE", "FEMALE"][randomInt(1)] as "MALE" | "FEMALE",
        nickName: `fake-user-${i}`,
        age: randomInt(65, 18),
        livingPref: prefs[randomInt(46)],
        photoPaths: [`https://i.pravatar.cc/?img=${i}`], // NOTE: img は 70 まで
      })
      .set();
    await userStat.set();
    await allUsersStat.signUp(user.id).set();
    i++;
  }

  // NOTE: メインユーザー
  {
    const authUser = await auth.createUser({
      email: "user-1@example.com",
      password: "password",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });
    const userStat = UserStatDoc.create(userStatsCollection.ref, { id: authUser.uid });

    const storagePath = `users/${user.id}/profilePhotos/${id()}`;
    await storage.bucket().upload(__dirname + "/fixture/man-1.png", { destination: storagePath });

    await user.edit({ nickName: "Messi", photoPaths: [storagePath] }).set();
    await userStat.set();
    await allUsersStat.signUp(user.id).set();
  }

  {
    const authUser = await auth.createUser({
      email: "user-2@example.com",
      password: "password",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });
    const userStat = UserStatDoc.create(userStatsCollection.ref, { id: authUser.uid });

    const storagePath = `users/${user.id}/profilePhotos/${id()}`;
    await storage.bucket().upload(__dirname + "/fixture/man-2.png", { destination: storagePath });

    await user.edit({ nickName: "CR7", photoPaths: [storagePath] }).set();
    await userStat.set();
    await allUsersStat.signUp(user.id).set();
  }
};

main();
