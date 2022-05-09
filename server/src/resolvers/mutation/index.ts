import { authorize } from "../../authorize";
import { LikeDoc } from "../../fire/docs/like";
import { MessageDoc } from "../../fire/docs/message";
import { MessageRoomDoc } from "../../fire/docs/message-room";
import { MessageRoomEventDoc } from "../../fire/docs/message-room-event";
import { UserDoc } from "../../fire/docs/user";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { usersCollection, userIndexCollection } = context.collections;
    const { firebase } = context;

    const { uid } = await firebase.auth.createUser({ email, password });

    const user = UserDoc.create(usersCollection.ref, { id: uid });
    await user.save();
    await userIndexCollection.add(user.toIndex());

    return user;
  },

  async access(_parent, _args, context) {
    authorize(context);

    const { uid } = context.auth;
    const { usersCollection, userIndexCollection } = context.collections;

    const user = await usersCollection.get(uid);
    await user.access().save();
    await userIndexCollection.update(user.toIndex());

    return user;
  },

  async updateUser(_parent, args, context) {
    authorize(context);

    const { uid } = context.auth;
    const { usersCollection, userIndexCollection } = context.collections;

    const user = await usersCollection.get(uid);
    await user.edit(args.input).save();
    await userIndexCollection.update(user.toIndex());

    return user;
  },

  async like(_parent, args, context) {
    authorize(context);

    const { userId } = args;
    const { uid } = context.auth;
    const { usersCollection, likesCollection, messageRoomsCollection, likeIndexCollection } = context.collections;

    const sendLike = await likesCollection.find({ senderId: uid, receiverId: userId });
    if (sendLike) throw new Error("sendLike already exists");

    const receiveLike = await likesCollection.find({ senderId: userId, receiverId: uid });
    if (receiveLike) {
      await receiveLike.match().save();
      await MessageRoomDoc.create(messageRoomsCollection.ref, {
        likeId: receiveLike.id,
        userIds: [receiveLike.senderId, receiveLike.receiverId],
      }).save();
      await likeIndexCollection.update(receiveLike.toIndex());
    } else {
      const like = LikeDoc.create(likesCollection, { senderId: uid, receiverId: userId });
      await like.save();
      await likeIndexCollection.add(like.toIndex());
    }

    return usersCollection.get(userId);
  },

  async unlike(_parent, args, context) {
    authorize(context);

    const { userId } = args;
    const { uid } = context.auth;
    const { usersCollection, likesCollection, likeIndexCollection } = context.collections;

    const sendLike = await likesCollection.find({ senderId: uid, receiverId: userId });
    if (!sendLike) throw new Error("sendLike not exists");

    await sendLike.delete();
    await likeIndexCollection.delete(sendLike.toIndex());

    return usersCollection.get(userId);
  },

  async skip(_parent, args, context) {
    authorize(context);

    const { userId } = args;
    const { uid } = context.auth;
    const { usersCollection, likesCollection, likeIndexCollection } = context.collections;

    const receiveLike = await likesCollection.find({ senderId: userId, receiverId: uid });
    if (!receiveLike) throw new Error("receiveLike not exists");

    await receiveLike.skip().save();
    await likeIndexCollection.update(receiveLike.toIndex());

    return usersCollection.get(userId);
  },

  async createMessage(_parent, args, context) {
    authorize(context);

    const { messageRoomId, content } = args.input;
    const { uid } = context.auth;
    const { messageRoomsCollection, messageRoomEventsCollection } = context.collections;

    const messageRoom = await messageRoomsCollection.get(messageRoomId);
    if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

    const message = await MessageDoc.create(messageRoom.messages.ref, { userId: uid, content }).save();

    await messageRoom.touch().save();
    await MessageRoomEventDoc.create(messageRoomEventsCollection.ref, {
      messageRoomId: messageRoom.id,
      messageId: message.id,
      action: "CREATE",
    }).save();

    return message;
  },
};
