import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MutationCancelLikeArgs } from "../../../graphql/generated";

export const cancelLikeMutation = async (
  _: unknown,
  { likeId }: MutationCancelLikeArgs,
  { auth, collections: { usersCollection, likesCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);

  const sendLike = await likesCollection.findOneById(likeId);
  if (!sendLike) throw new Error("Can't cancelLike, because like don't exist");

  const receiver = await usersCollection.findOne(sendLike.receiverId);

  await sendLike.delete();
  await user.likeIndexCollection.delete(sendLike.indexData);
  await receiver.likeIndexCollection.delete(sendLike.indexData);

  return receiver;
};
