import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageRoomDoc } from "../../../fire/docs/message-room";
import { MutationMatchLikeArgs } from "../../../graphql/generated";
import { onUpdateLike } from "../../../psuedo-trigger/like";

export const matchLikeMutation = async (
  _: unknown,
  { userId }: MutationMatchLikeArgs,
  { auth, collections: { usersCollection, likesCollection, messageRoomsCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const receiveLike = await likesCollection.findBySenderAndReceiver({ senderId: userId, receiverId: auth.uid });
  if (!receiveLike) throw new Error("Can't matchLike, because like don't exist");

  receiveLike.match();
  const messageRoom = MessageRoomDoc.create(messageRoomsCollection, {
    likeId: receiveLike.id,
    userIds: [receiveLike.senderId, receiveLike.receiverId],
  });

  await receiveLike.save();
  await messageRoom.save();
  await onUpdateLike({ like: receiveLike }, { userLikeIndexCollection });

  return messageRoom;
};
