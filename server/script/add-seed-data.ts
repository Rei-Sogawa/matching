import { createCollections } from "../src/fire/create-collections";
import { LikeDoc } from "../src/fire/docs/like";
import { UserDoc } from "../src/fire/docs/user";
import { prefs } from "../src/utils/contants";
import { getAuth, getDb, getStorage, id, randomInt } from "./script-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, userIndexShardsCollection, likesCollection, likeIndexShardsCollection } = collections;

const main = async () => {
  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 15 }).map((_, i) => {
      return { uid: id(), email: `fake-user-${i}@example.com`, password: "password" };
    })
  );

  const fakeUsers = [];
  let i = 0;
  for (const fakeAuthUser of fakeAuthUsers) {
    const user = UserDoc.create(usersCollection.ref, { id: fakeAuthUser.uid });

    await user
      .edit({
        gender: ["MALE", "FEMALE"][randomInt(1)] as "MALE" | "FEMALE",
        nickName: `fake-user-${i}`,
        age: randomInt(65, 18),
        livingPref: prefs[randomInt(46)],
        photoPaths: [`https://i.pravatar.cc/?img=${i}`], // NOTE: img は 70 まで
      })
      .set();
    const userIndexShard = await userIndexShardsCollection.get();
    await userIndexShard.addIndex(...user.toIndex()).set();

    fakeUsers.push(user);
    i++;
  }

  // NOTE: メインユーザー
  let user1;
  let user2;

  {
    const authUser = await auth.createUser({
      email: "user-1@example.com",
      password: "password",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const storagePath = `users/${user.id}/profilePhotos/${id()}`;
    await storage.bucket().upload(__dirname + "/fixture/man-1.png", { destination: storagePath });

    await user.edit({ nickName: "Messi", photoPaths: [storagePath] }).set();
    const userIndexShard = await userIndexShardsCollection.get();
    await userIndexShard.addIndex(...user.toIndex()).set();

    user1 = user;
  }

  {
    const authUser = await auth.createUser({
      email: "user-2@example.com",
      password: "password",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const storagePath = `users/${user.id}/profilePhotos/${id()}`;
    await storage.bucket().upload(__dirname + "/fixture/man-2.png", { destination: storagePath });

    await user.edit({ nickName: "CR7", photoPaths: [storagePath] }).set();
    const userIndexShard = await userIndexShardsCollection.get();
    await userIndexShard.addIndex(...user.toIndex()).set();

    user2 = user;
  }

  for (const fakeUser of fakeUsers) {
    const likeIndexShard = await likeIndexShardsCollection.get();

    const like = LikeDoc.create(likesCollection.ref, {
      senderId: fakeUser.id,
      receiverId: [user1, user2][randomInt(1)].id,
    });
    likeIndexShard.addIndex(...like.toIndex());

    await like.set();
    await likeIndexShard.set();
  }
};

main();
