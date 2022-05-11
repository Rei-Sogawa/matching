import { authorize } from "../../authorize";
import { Context } from "../../context";

export const unlikeMutation = async (_: unknown, args: { userId: string }, context: Context) => {
  authorize(context);

  const { userId } = args;
  const { uid } = context.auth;
  const { usersCollection, likesCollection, likeIndexCollection } = context.collections;

  const sendLike = await likesCollection.findBySenderAndReceiver({ senderId: uid, receiverId: userId });
  if (!sendLike) throw new Error("sendLike not exists");

  await sendLike.delete();
  await likeIndexCollection.delete(sendLike.toIndex);

  return usersCollection.findOne(userId);
};
