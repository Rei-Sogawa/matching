import { authorize } from "../../authorize";
import { LikeDoc } from "../../fire/docs/like";
import { UserDoc } from "../../fire/docs/user";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth, db } = context;
    const { usersCollection } = context.collections;

    const { uid } = await auth.createUser({ email, password });

    const batch = db.batch();

    const user = UserDoc.create(usersCollection.ref, { id: uid });

    batch.set(...user.toBatch());
    await batch.commit();

    return user;
  },

  async access(_parent, _args, context) {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { db } = context;
    const { usersCollection } = context.collections;

    const batch = db.batch();

    const user = await usersCollection.findOneById(uid);
    user.access();

    batch.set(...user.toBatch());
    await batch.commit();

    return user;
  },

  async updateUser(_parent, args, context) {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection } = context.collections;

    const user = await usersCollection.findOneById(uid);
    user.edit(args.input);
    return user.set();
  },

  async like(_parent, args, context) {
    authorize(context);

    const { userId: targetUserId } = args;
    const { uid: actionUserId } = context.decodedIdToken;
    const { db } = context;
    const { usersCollection, likesCollection } = context.collections;

    const sentLike = await likesCollection.find({ senderId: actionUserId, receiverId: targetUserId });
    if (sentLike) throw new Error("sentLike exists");
    const receivedLike = await likesCollection.find({ senderId: targetUserId, receiverId: actionUserId });

    const batch = db.batch();

    if (receivedLike) {
      receivedLike.match();
      batch.set(...receivedLike.toBatch());
    } else {
      const like = LikeDoc.create(likesCollection.ref, { senderId: actionUserId, receiverId: targetUserId });
      batch.set(...like.toBatch());
    }

    await batch.commit();

    return usersCollection.findOneById(targetUserId);
  },
};
