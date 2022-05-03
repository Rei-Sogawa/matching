import { createCollections } from "../src/fire/create-collections";
import { UserData } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { now } from "../src/utils/now";
import { getDb, id, randomInt } from "./script-utils";

const db = getDb();

const collections = createCollections(db);
const { usersCollection, allUsersStatsCollection } = collections;

const main = async () => {
  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 25 }).map((_, i) => {
      return { uid: id(), email: `fake-user-${i}@example.com`, password: "password" };
    })
  );

  const fakeUsers = await Promise.all(
    fakeAuthUsers.map((authUser, i) => {
      const createdAt = now();
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
};

main();
