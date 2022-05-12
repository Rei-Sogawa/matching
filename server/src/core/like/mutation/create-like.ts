import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { LikeDoc } from "../../../fire/docs/like";
import { MutationCreateLikeArgs } from "../../../graphql/generated";

export const createLikeMutation = async (
  _: unknown,
  { userId }: MutationCreateLikeArgs,
  { auth, collections: { usersCollection, likesCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);
  const receiver = await usersCollection.findOne(userId);

  const sendLike = await likesCollection.findBySenderAndReceiver({ senderId: user.id, receiverId: receiver.id });
  if (sendLike) throw new Error("Can't createLike, because already like");

  const like = LikeDoc.create(likesCollection, { senderId: user.id, receiverId: receiver.id });

  await like.save();
  await user.likeIndexCollection.add(like.indexData);
  await receiver.likeIndexCollection.add(like.indexData);

  return receiver;
};
