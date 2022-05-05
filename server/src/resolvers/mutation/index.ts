import { authorize } from "../../authorize";
import { LikeDoc } from "../../fire/docs/like";
import { UserDoc } from "../../fire/docs/user";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth, db } = context;
    const { usersCollection, userIndexShardsCollection } = context.collections;

    const { uid } = await auth.createUser({ email, password });

    const user = UserDoc.create(usersCollection.ref, { id: uid });
    const userIndexShard = await userIndexShardsCollection.get();
    userIndexShard.addIndex(...user.toIndex());

    const batch = db.batch();
    batch.set(...user.toBatch());
    batch.set(...userIndexShard.toBatch());
    await batch.commit();

    return user;
  },

  async access(_parent, _args, context) {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { db } = context;
    const { usersCollection } = context.collections;

    const user = await usersCollection.findOneById(uid);
    user.access();

    const batch = db.batch();
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
    const { usersCollection, likesCollection, likeIndexShardsCollection } = context.collections;

    const sentLike = await likesCollection.find({ senderId: actionUserId, receiverId: targetUserId });
    if (sentLike) throw new Error("sentLike exists");
    const receivedLike = await likesCollection.find({ senderId: targetUserId, receiverId: actionUserId });

    const batch = db.batch();

    if (receivedLike) {
      const likeIndexShard = await likeIndexShardsCollection.getById(receivedLike.id);

      receivedLike.match();
      likeIndexShard.editIndex(...receivedLike.toIndex());

      batch.set(...receivedLike.toBatch());
      batch.set(...likeIndexShard.toBatch());
    } else {
      const like = LikeDoc.create(likesCollection.ref, { senderId: actionUserId, receiverId: targetUserId });
      const likeIndexShard = await likeIndexShardsCollection.get();

      likeIndexShard.addIndex(...like.toIndex());

      batch.set(...like.toBatch());
      batch.set(...likeIndexShard.toBatch());
    }

    await batch.commit();

    return usersCollection.findOneById(targetUserId);
  },
};
