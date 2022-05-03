import { FieldValue } from "firebase-admin/firestore";
import { head } from "lodash";

import { authorize } from "../../authorize";
import { LikeDoc, UserStatDoc } from "../../fire/docs";
import { UserDoc } from "../../fire/docs/user";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth } = context;
    const { usersCollection, userStatsCollection, allUsersStatsCollection } = context.collections;

    const { uid } = await auth.createUser({ email, password });

    await allUsersStatsCollection.merge({ userIds: [uid] });

    const userStatData = UserStatDoc.create({
      sendLikeUserIds: [],
      receiveLikeUserIds: [],
      skipLikeUserIds: [],
      matchUserIds: [],
    });
    await userStatsCollection.insert({ id: uid, ...userStatData });

    const userData = UserDoc.create({
      gender: "MALE",
      nickName: "ニックネーム",
      age: 30,
      livingPref: "東京",
      photoPaths: [],
    });
    return usersCollection.insert({ id: uid, ...userData });
  },

  async updateUser(_parent, args, context) {
    authorize(context);

    const { authContext } = context;
    const { usersCollection } = context.collections;

    const user = await usersCollection.findOneById(authContext.uid);
    user.edit(args.input);
    return user.update();
  },

  async like(_parent, args, context) {
    authorize(context);

    const { userId } = args;
    const { uid } = context.authContext;
    const { usersCollection, userStatsCollection, likesCollection } = context.collections;

    const _sendedLike = await likesCollection.findManyByQuery((ref) => ref.where("senderId", "==", uid));
    const sendedLike = head(_sendedLike);
    if (sendedLike) throw new Error("Already liked");

    const _receivedLike = await likesCollection.findManyByQuery((ref) => ref.where("receiverId", "==", uid));
    const receivedLike = head(_receivedLike);

    if (receivedLike) {
      receivedLike.edit({ status: "MATCHED" });
      await receivedLike.update();
    } else {
      const likeData = LikeDoc.create({ senderId: uid, receiverId: userId, status: "PENDING" });
      await likesCollection.insert(likeData);
    }

    const likeUserStat = await userStatsCollection.findOneById(uid);
    const likedUserStat = await userStatsCollection.findOneById(userId);

    if (receivedLike) {
      await likeUserStat.ref.update({ matchUserIds: FieldValue.arrayUnion(userId) });
      await likedUserStat.ref.update({ matchUserIds: FieldValue.arrayUnion(uid) });
    } else {
      await likeUserStat.ref.update({ sendLikeUserIds: FieldValue.arrayUnion(userId) });
      await likedUserStat.ref.update({ receiveLikeUserIds: FieldValue.arrayUnion(uid) });
    }

    return usersCollection.findOneById(args.userId);
  },
};
