import { createCollections } from "../src/fire/create-collections";
import { UserDoc } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { getDb, id, randomInt } from "./script-utils";

const db = getDb();

const collections = createCollections(db);
const { usersCollection, usersStatShards } = collections;

const main = async () => {
  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 25 }).map((_, i) => {
      return { uid: id(), email: `fake-user-${i}@example.com`, password: "password" };
      // return auth.createUser({ email: `fake-user-${i}@example.com`, password: "password" });
    })
  );

  const fakeUsers = await Promise.all(
    fakeAuthUsers.map((authUser, i) => {
      return usersCollection.insert({
        id: authUser.uid,
        ...UserDoc.create({
          gender: ["MALE", "FEMALE"][randomInt(1)] as "MALE" | "FEMALE",
          nickName: `fake-user-${i}`,
          age: randomInt(65, 18),
          livingPref: prefs[randomInt(46)],
          // NOTE: img は 70 まで
          photoPaths: [`https://i.pravatar.cc/?img=${i}`],
        }),
      });
    })
  );

  for (const fakeUser of fakeUsers) {
    await usersStatShards.insert({ userIds: [fakeUser.id] });
  }
};

main();
