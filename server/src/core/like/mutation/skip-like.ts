import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MutationSkipLikeArgs } from "../../../graphql/generated";
import { onUpdateLike } from "../../../psuedo-trigger/like";

export const skipLikeMutation = async (
  _: unknown,
  { userId }: MutationSkipLikeArgs,
  { auth, collections: { usersCollection, likesCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const sendLike = await likesCollection.findBySenderAndReceiver({ senderId: userId, receiverId: auth.uid });
  if (!sendLike) throw new Error("Can't skipLike, because like don't exist");

  sendLike.skip();

  await sendLike.save();
  await onUpdateLike(sendLike, { userLikeIndexCollection });

  return usersCollection.findOne(sendLike.receiverId);
};
