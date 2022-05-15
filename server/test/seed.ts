import { createCollections } from "../src/fire/create-collections";
import { LikeDoc } from "../src/fire/docs/like";
import { MessageDoc } from "../src/fire/docs/message";
import { MessageRoomDoc } from "../src/fire/docs/message-room";
import { UserDoc } from "../src/fire/docs/user";
import { onCreateLike } from "../src/psuedo-trigger/like";
import { onCreateUser } from "../src/psuedo-trigger/user";
import { prefs } from "../src/utils/contants";
import { clearAuth, clearFirestore, getAuth, getDb, getStorage, id, randomInt } from "./test-utils";

const auth = getAuth();
const db = getDb();
const storage = getStorage();

const collections = createCollections(db);
const { usersCollection, likesCollection, messageRoomsCollection, userIndexCollection, userLikeIndexCollection } =
  collections;

const seed = async () => {
  const fakeAuthUsers = await Promise.all(
    Array.from({ length: 10 }).map((_, i) => {
      return { uid: id(), email: `fake-user-${i}@example.com`, password: "password" };
    })
  );

  const fakeUsers = [];
  let i = 0;
  for (const fakeAuthUser of fakeAuthUsers) {
    const user = UserDoc.create(usersCollection, fakeAuthUser.uid);

    await user
      .edit({
        gender: ["MALE", "FEMALE"][randomInt(1)] as "MALE" | "FEMALE",
        nickName: `fake-user-${i}`,
        age: randomInt(65, 18),
        livingPref: prefs[randomInt(46)],
        photoPaths: [`https://i.pravatar.cc/?img=${i}`], // NOTE: img は 70 まで
      })
      .save();
    await onCreateUser({ user }, { userIndexCollection });

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
    const user = UserDoc.create(usersCollection, authUser.uid);

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage
        .bucket()
        .upload(__dirname + `/fixture/nao-${i + 1}.png`, { destination: storagePath, contentType: "image/png" });
      paths.push(storagePath);
    }

    await user.edit({ gender: "FEMALE", nickName: "Nao", age: 34, livingPref: "新潟県", photoPaths: paths }).save();
    await onCreateUser({ user }, { userIndexCollection });

    nao = user;
  }

  {
    const authUser = await auth.createUser({
      uid: "1989-06-03",
      email: "megu@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection, authUser.uid);

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage
        .bucket()
        .upload(__dirname + `/fixture/megu-${i + 1}.png`, { destination: storagePath, contentType: "image/png" });
      paths.push(storagePath);
    }

    await user.edit({ gender: "FEMALE", nickName: "Megu", age: 32, livingPref: "新潟県", photoPaths: paths }).save();
    await onCreateUser({ user }, { userIndexCollection });

    megu = user;
  }

  {
    const authUser = await auth.createUser({
      uid: "1991-09-15",
      email: "kaede@example.com",
      password: "Password00",
    });
    const user = UserDoc.create(usersCollection, authUser.uid);

    const paths = [];
    for (const i of Array.from({ length: 3 }).map((_, i) => i)) {
      const storagePath = `users/${user.id}/profilePhotos/${id()}`;
      await storage
        .bucket()
        .upload(__dirname + `/fixture/kaede-${i + 1}.png`, { destination: storagePath, contentType: "image/png" });
      paths.push(storagePath);
    }

    await user.edit({ gender: "FEMALE", nickName: "Kaede", age: 30, livingPref: "新潟県", photoPaths: paths }).save();
    await onCreateUser({ user }, { userIndexCollection });

    kaede = user;
  }

  for (const fakeUser of fakeUsers) {
    const receiverId = [nao, megu, kaede][randomInt(2)].id;
    const like = LikeDoc.create(likesCollection, {
      senderId: fakeUser.id,
      receiverId,
    });
    await like.save();
    await onCreateLike({ like }, { userLikeIndexCollection });
  }

  const like = await LikeDoc.create(likesCollection, { senderId: nao.id, receiverId: megu.id }).match().save();
  await onCreateLike({ like }, { userLikeIndexCollection });

  const messageRoom = await MessageRoomDoc.create(messageRoomsCollection, {
    likeId: like.id,
    userIds: [like.senderId, like.receiverId],
  })
    .touch()
    .save();

  for (const i of Array.from({ length: 30 }).map((_, i) => i)) {
    const message = MessageDoc.create(messageRoom.messagesCollection, {
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
