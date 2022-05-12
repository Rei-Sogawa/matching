import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MutationSkipLikeArgs } from "../../../graphql/generated";

export const skipLikeMutation = async (
  _: unknown,
  { likeId }: MutationSkipLikeArgs,
  { auth, collections: { usersCollection, likesCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);

  const sendLike = await likesCollection.findOneById(likeId);
  if (!sendLike) throw new Error("Can't skipLike, because like don't exist");

  const receiver = await usersCollection.findOne(sendLike.receiverId);

  sendLike.skip();

  await sendLike.save();
  await user.likeIndexCollection.update(sendLike.indexData);
  await receiver.likeIndexCollection.update(sendLike.indexData);

  return receiver;
};
