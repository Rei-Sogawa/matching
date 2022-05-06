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

    const sendLike = await likesCollection.find({ senderId: actionUserId, receiverId: targetUserId });
    if (sendLike) throw new Error("sendLike exists");
    const receiveLike = await likesCollection.find({ senderId: targetUserId, receiverId: actionUserId });

    const batch = db.batch();

    if (receiveLike) {
      const likeIndexShard = await likeIndexShardsCollection.getById(receiveLike.id);

      receiveLike.match();
      likeIndexShard.editIndex(...receiveLike.toIndex());

      batch.set(...receiveLike.toBatch());
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

  async unlike(_parent, args, context) {
    authorize(context);

    const { userId } = args;
    const { uid } = context.decodedIdToken;
    const { db } = context;
    const { usersCollection, likesCollection, likeIndexShardsCollection } = context.collections;

    const sendLike = await likesCollection.find({ senderId: uid, receiverId: userId });
    if (!sendLike) throw new Error("sendLike not exists");
    const likeIndexShard = await likeIndexShardsCollection.getById(sendLike.id);

    likeIndexShard.removeIndex(sendLike.id);

    const batch = db.batch();
    batch.delete(sendLike.ref);
    batch.set(...likeIndexShard.toBatch());
    await batch.commit();

    return usersCollection.findOneById(userId);
  },

  async skip(_parent, args, context) {
    authorize(context);

    const { userId } = args;
    const { uid } = context.decodedIdToken;
    const { db } = context;
    const { usersCollection, likesCollection, likeIndexShardsCollection } = context.collections;

    const sendLike = await likesCollection.find({ senderId: userId, receiverId: uid });
    if (!sendLike) throw new Error("sendLike not exists");
    const likeIndexShard = await likeIndexShardsCollection.getById(sendLike.id);

    sendLike.skip();
    likeIndexShard.editIndex(...sendLike.toIndex());

    const batch = db.batch();
    batch.set(...sendLike.toBatch());
    batch.set(...likeIndexShard.toBatch());
    await batch.commit();

    return usersCollection.findOneById(userId);
  },
};
