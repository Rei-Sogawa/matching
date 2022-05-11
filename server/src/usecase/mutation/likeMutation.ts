import { authorize } from "../../authorize";
import { Context } from "../../context";
import { LikeDoc } from "../../fire/docs/like";
import { MessageRoomDoc } from "../../fire/docs/message-room";

export const likeMutation = async (_: unknown, args: { userId: string }, context: Context) => {
  authorize(context);

  const { userId } = args;
  const { uid } = context.auth;
  const { usersCollection, likesCollection, messageRoomsCollection, likeIndexCollection } = context.collections;

  const sendLike = await likesCollection.findBySenderAndReceiver({ senderId: uid, receiverId: userId });
  if (sendLike) throw new Error("sendLike already exists");

  const receiveLike = await likesCollection.findBySenderAndReceiver({ senderId: userId, receiverId: uid });
  if (receiveLike) {
    await receiveLike.match().save();
    await MessageRoomDoc.create(messageRoomsCollection, {
      likeId: receiveLike.id,
      userIds: [receiveLike.senderId, receiveLike.receiverId],
    }).save();
    await likeIndexCollection.update(receiveLike.toIndex);
  } else {
    const like = LikeDoc.create(likesCollection, { senderId: uid, receiverId: userId });
    await like.save();
    await likeIndexCollection.add(like.toIndex);
  }

  return usersCollection.findOne(userId);
};
