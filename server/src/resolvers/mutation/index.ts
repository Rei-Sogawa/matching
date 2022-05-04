import { authorize } from "../../authorize";
import { LikeDoc, UserDoc, UserStatDoc } from "../../fire/docs";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth, db } = context;
    const { allUsersStatsCollection, usersCollection, userStatsCollection } = context.collections;

    const allUsersStat = await allUsersStatsCollection.get();

    const { uid } = await auth.createUser({ email, password });
    const user = UserDoc.create(usersCollection.ref, { id: uid });
    const userStat = UserStatDoc.create(userStatsCollection.ref, { id: uid });

    const batch = db.batch();
    batch.set(...user.toBatch());
    batch.set(...userStat.toBatch());
    batch.set(...allUsersStat.signUp(uid).toBatch());

    await batch.commit();

    return user;
  },

  async updateUser(_parent, args, context) {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection } = context.collections;

    const user = await usersCollection.findOneById(uid);
    return user.edit(args.input).set();
  },

  async like(_parent, args, context) {
    authorize(context);

    const { userId: targetUserId } = args;
    const { uid: actionUserId } = context.decodedIdToken;
    const { db } = context;
    const { usersCollection, userStatsCollection, likesCollection } = context.collections;

    const sentLike = await likesCollection.find({ senderId: actionUserId, receiverId: targetUserId });
    if (sentLike) throw new Error("sentLike exists");
    const receivedLike = await likesCollection.find({ senderId: targetUserId, receiverId: actionUserId });
    const actionUserStat = await userStatsCollection.findOneById(actionUserId);
    const targetUserStat = await userStatsCollection.findOneById(targetUserId);

    const batch = db.batch();

    if (receivedLike) {
      receivedLike.match();
      batch.set(...receivedLike.toBatch());

      actionUserStat.match(targetUserId);
      targetUserStat.match(actionUserId);
    } else {
      const like = LikeDoc.create(likesCollection.ref, { senderId: actionUserId, receiverId: targetUserId });
      batch.set(...like.toBatch());

      actionUserStat.sendLike(targetUserId);
      targetUserStat.receiveLike(actionUserId);
    }

    batch.set(...actionUserStat.toBatch());
    batch.set(...targetUserStat.toBatch());

    await batch.commit();

    return usersCollection.findOneById(targetUserId);
  },
};
