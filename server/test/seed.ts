import { createCollections } from "../src/fire/create-collections";
import { LikeDoc } from "../src/fire/docs/like";
import { MessageDoc } from "../src/fire/docs/message";
import { MessageRoomDoc } from "../src/fire/docs/message-room";
import { UserDoc } from "../src/fire/docs/user";
import { prefs } from "../src/utils/contants";
import { clearAuth, clearFirestore, getAuth, getDb, getStorage, id, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, likesCollection, messageRoomsCollection, userIndexCollection, likeIndexCollection } =
  collections;

const seed = async () => {
  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 50 }).map((_, i) => {
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
      uid: "1988-04-10",
      email: "nao@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage
        .bucket()
        .upload(__dirname + `/fixture/nao-${i + 1}.png`, { destination: storagePath, contentType: "image/png" });
      paths.push(storagePath);
    }

    await user.edit({ gender: "FEMALE", nickName: "Nao", age: 34, livingPref: "新潟県", photoPaths: paths }).save();
    await userIndexCollection.add(user.toIndex());

    nao = user;
  }

  {
    const authUser = await auth.createUser({
      uid: "1989-06-03",
      email: "megu@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage
        .bucket()
        .upload(__dirname + `/fixture/megu-${i + 1}.png`, { destination: storagePath, contentType: "image/png" });
      paths.push(storagePath);
    }

    await user.edit({ gender: "FEMALE", nickName: "Megu", age: 32, livingPref: "新潟県", photoPaths: paths }).save();
    await userIndexCollection.add(user.toIndex());

    megu = user;
  }

  {
    const authUser = await auth.createUser({
      uid: "1991-09-15",
      email: "kaede@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection.ref, { id: authUser.uid });

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage
        .bucket()
        .upload(__dirname + `/fixture/kaede-${i + 1}.png`, { destination: storagePath, contentType: "image/png" });
      paths.push(storagePath);
    }

    await user.edit({ gender: "FEMALE", nickName: "Kaede", age: 30, livingPref: "新潟県", photoPaths: paths }).save();
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

  const like = await LikeDoc.create(likesCollection.ref, { senderId: nao.id, receiverId: megu.id }).match().save();
  const messageRoom = await MessageRoomDoc.create(messageRoomsCollection.ref, {
    likeId: like.id,
    userIds: [like.senderId, like.receiverId],
  })
    .touch()
    .save();

  for (const i of Array.from({ length: 50 }).map((_, i) => i)) {
    const message = MessageDoc.create(messageRoom.messages.ref, {
      userId: messageRoom.userIds[i % 2],
      content: i.toString(),
    });
    await message.save();
  }
};

const main = async () => {
  await clearAuth();
  await clearFirestore();

  await seed();
};

main();
