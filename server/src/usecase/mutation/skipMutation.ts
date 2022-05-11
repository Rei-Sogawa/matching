import { authorize } from "../../authorize";
import { Context } from "../../context";

export const skipMutation = async (_: unknown, args: { userId: string }, context: Context) => {
  authorize(context);

  const { userId } = args;
  const { uid } = context.auth;
  const { usersCollection, likesCollection, likeIndexCollection } = context.collections;

  const receiveLike = await likesCollection.findBySenderAndReceiver({ senderId: userId, receiverId: uid });
  if (!receiveLike) throw new Error("receiveLike not exists");

  await receiveLike.skip().save();
  await likeIndexCollection.update(receiveLike.toIndex);

  return usersCollection.get(userId);
};
