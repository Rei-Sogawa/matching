import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { LikeDoc } from "../../../fire/docs/like";
import { MutationCreateLikeArgs } from "../../../graphql/generated";
import { onCreateLike } from "../../../psuedo-trigger/like";

export const createLikeMutation = async (
  _: unknown,
  { userId }: MutationCreateLikeArgs,
  { auth, collections: { usersCollection, likesCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const sendLike = await likesCollection.findBySenderAndReceiver({ senderId: auth.uid, receiverId: userId });
  if (sendLike) throw new Error("Can't createLike, because already like");

  const like = LikeDoc.create(likesCollection, { senderId: auth.uid, receiverId: userId });

  await like.save();
  await onCreateLike(like, { userLikeIndexCollection });

  return usersCollection.findOne(userId);
};
