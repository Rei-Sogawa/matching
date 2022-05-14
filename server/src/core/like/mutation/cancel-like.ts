import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MutationCancelLikeArgs } from "../../../graphql/generated";
import { onDeleteLike } from "../../../psuedo-trigger/like";

export const cancelLikeMutation = async (
  _: unknown,
  { userId }: MutationCancelLikeArgs,
  { auth, collections: { usersCollection, likesCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const sendLike = await likesCollection.findBySenderAndReceiver({ senderId: userId, receiverId: auth.uid });
  if (!sendLike) throw new Error("Can't cancelLike, because like don't exist");

  await sendLike.delete();
  await onDeleteLike(sendLike, { userLikeIndexCollection });

  return usersCollection.findOne(sendLike.receiverId);
};
