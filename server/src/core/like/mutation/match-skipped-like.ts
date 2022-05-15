import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageRoomDoc } from "../../../fire/docs/message-room";
import { MutationMatchSkippedLikeArgs } from "../../../graphql/generated";
import { onUpdateLike } from "../../../psuedo-trigger/like";

export const matchSkippedLikeMutation = async (
  _: unknown,
  { userId }: MutationMatchSkippedLikeArgs,
  { auth, collections: { likesCollection, messageRoomsCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const skippedLike = await likesCollection.findBySenderAndReceiver({ senderId: userId, receiverId: auth.uid });
  if (!skippedLike) throw new Error("Can't matchSkippedLike, because like don't exist");

  skippedLike.matchFromSkipped();
  const messageRoom = MessageRoomDoc.create(messageRoomsCollection, {
    likeId: skippedLike.id,
    userIds: [skippedLike.senderId, skippedLike.receiverId],
  });

  await skippedLike.save();
  await messageRoom.save();
  await onUpdateLike({ like: skippedLike }, { userLikeIndexCollection });

  return messageRoom;
};
