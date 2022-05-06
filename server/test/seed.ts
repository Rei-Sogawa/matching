import { createCollections } from "../src/fire/create-collections";
import { LikeDoc } from "../src/fire/docs/like";
import { UserDoc } from "../src/fire/docs/user";
import { prefs } from "../src/utils/contants";
import { clearAuth, clearFirestore, getAuth, getDb, getStorage, id, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, userIndexCollection, likesCollection, likeIndexCollection } = collections;

const main = async () => {
  await clearAuth();
  await clearFirestore();

  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
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
      .save();
    await userIndexCollection.add(user.toIndex());

    fakeUsers.push(user);
    i++;
  }

  // NOTE: メインユーザー
  let nao;
  let megu;
  let kaede;

  {
    const authUser = await auth.createUser({
      email: "nao@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage.bucket().upload(__dirname + `/fixture/nao-${i + 1}.png`, { destination: storagePath });
      paths.push(storagePath);
    }

    await user.edit({ age: 34, nickName: "Nao", livingPref: "新潟県", photoPaths: paths }).save();
    await userIndexCollection.add(user.toIndex());

    nao = user;
  }

  {
    const authUser = await auth.createUser({
      email: "megu@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage.bucket().upload(__dirname + `/fixture/megu-${i + 1}.png`, { destination: storagePath });
      paths.push(storagePath);
    }

    await user.edit({ age: 32, nickName: "Megu", livingPref: "新潟県", photoPaths: paths }).save();
    await userIndexCollection.add(user.toIndex());

    megu = user;
  }

  {
    const authUser = await auth.createUser({
      email: "kaede@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage.bucket().upload(__dirname + `/fixture/kaede-${i + 1}.png`, { destination: storagePath });
      paths.push(storagePath);
    }

    await user.edit({ age: 30, nickName: "Kaede", livingPref: "新潟県", photoPaths: paths }).save();
    await userIndexCollection.add(user.toIndex());

    kaede = user;
  }

  for (const fakeUser of fakeUsers) {
    const like = LikeDoc.create(likesCollection.ref, {
      senderId: fakeUser.id,
      receiverId: [nao, megu, kaede][randomInt(2)].id,
    });
    await like.save();
    await likeIndexCollection.add(like.toIndex());
  }
};

main();
