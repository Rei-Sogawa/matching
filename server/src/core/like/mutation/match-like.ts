import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageRoomDoc } from "../../../fire/docs/message-room";
import { MutationMatchLikeArgs } from "../../../graphql/generated";
import { onUpdateLike } from "../../../psuedo-trigger/like";

export const matchLikeMutation = async (
  _: unknown,
  { likeId }: MutationMatchLikeArgs,
  { auth, collections: { usersCollection, likesCollection, messageRoomsCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const receiveLike = await likesCollection.findOneById(likeId);
  if (!receiveLike) throw new Error("Can't matchLike, because like don't exist");

  receiveLike.match();
  const messageRoom = MessageRoomDoc.create(messageRoomsCollection, {
    likeId: receiveLike.id,
    userIds: [receiveLike.senderId, receiveLike.receiverId],
  });

  await receiveLike.save();
  await messageRoom.save();
  await onUpdateLike(receiveLike, { userLikeIndexCollection });

  return usersCollection.findOne(receiveLike.senderId);
};
