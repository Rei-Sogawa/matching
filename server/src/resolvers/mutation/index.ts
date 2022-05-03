import { authorize } from "../../authorize";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth } = context;
    const { usersCollection, userStatsCollection, allUsersStatsCollection } = context.collections;

    const { uid } = await auth.createUser({ email, password });

    await allUsersStatsCollection.merge({ userIds: [uid] });
    await userStatsCollection.create(uid);
    return usersCollection.create(uid);
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

    const { userId: targetUserId } = args;
    const { uid: actionUserId } = context.authContext;
    const { usersCollection, likesCollection } = context.collections;

    const sentLike = await likesCollection.find({ senderId: actionUserId, receiverId: targetUserId });
    if (sentLike) throw new Error("Already liked");

    const receivedLike = await likesCollection.find({ senderId: targetUserId, receiverId: actionUserId });
    if (receivedLike) {
      await receivedLike.match();
    } else {
      await likesCollection.create({ senderId: actionUserId, receiverId: targetUserId });
    }

    return usersCollection.findOneById(targetUserId);
  },
};
