import { authorize } from "../../authorize";
import { UserDoc, UserStatDoc } from "../../fire/docs";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth } = context;
    const { usersCollection, userStatsCollection, allUsersStatsCollection } = context.collections;

    const { uid } = await auth.createUser({ email, password });

    const user = UserDoc.create(usersCollection.ref);
    const userStat = UserStatDoc.create(userStatsCollection.ref, { id: uid });

    await allUsersStatsCollection.merge({ userIds: [uid] });

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
    const { usersCollection, likesCollection } = context.collections;

    const sentLike = await likesCollection.find({ senderId: actionUserId, receiverId: targetUserId });
    if (sentLike) throw new Error("sentLike exists");

    const receivedLike = await likesCollection.find({ senderId: targetUserId, receiverId: actionUserId });
    if (receivedLike) {
      await receivedLike.match().set();
    } else {
      await likesCollection.create({ senderId: actionUserId, receiverId: targetUserId });
    }

    return usersCollection.findOneById(targetUserId);
  },
};
