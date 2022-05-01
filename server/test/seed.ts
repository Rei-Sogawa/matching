import { createCollections } from "../src/fire/create-collections";
import { UserDoc } from "../src/fire/docs";
import { prefs } from "../src/utils/contants";
import { clearAuth, clearFirestore, getAuth, getDb, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();

const collections = createCollections(db);
const { usersCollection } = collections;

const main = async () => {
  await clearAuth();
  await clearFirestore();

  const authUsers = await Promise.all(
    Array.from({ length: 25 }).map((_, i) => {
      return auth.createUser({ email: `fake-user-${i}@example.com`, password: "password" });
    })
  );

  const users = await Promise.all(
    authUsers.map((authUser, i) => {
      return usersCollection.insert({
        id: authUser.uid,
        ...UserDoc.createData({
          gender: ["MALE", "FEMALE"][randomInt(1, 0)] as "MALE" | "FEMALE",
          nickName: `fake-user-${i}`,
          age: randomInt(65, 18),
          livingPref: prefs[randomInt(46)],
          photoPaths: [`https://i.pravatar.cc/?img=${i}`],
        }),
      });
    })
  );
};

main();
