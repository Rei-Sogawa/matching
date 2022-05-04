import { createCollections } from "../src/fire/create-collections";
import { UserDoc, UserStatDoc } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { getDb, id, randomInt } from "./script-utils";

const db = getDb();

const collections = createCollections(db);
const { allUsersStatsCollection, usersCollection, userStatsCollection } = collections;

const main = async () => {
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
    i++;
  }

  const allUsersStat = await allUsersStatsCollection.get();
  await allUsersStat
    .edit({
      userIds: fakeAuthUsers.map(({ uid }) => uid),
    })
    .set();
};

main();
