import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MessageRoomDoc } from "../../../fire/docs/message-room";
import { UserDoc } from "../../../fire/docs/user";
import { MutationMatchLikeArgs } from "../../../graphql/generated";

export const matchLikeMutation = async (
  _: unknown,
  { likeId }: MutationMatchLikeArgs,
  { auth, collections: { usersCollection, likesCollection, messageRoomsCollection } }: Context
): Promise<UserDoc> => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);

  const receiveLike = await likesCollection.findOneById(likeId);
  if (!receiveLike) throw new Error("Can't matchLike, because like don't exist");

  const sender = await usersCollection.findOne(receiveLike.senderId);

  receiveLike.match();
  const messageRoom = MessageRoomDoc.create(messageRoomsCollection, {
    likeId: receiveLike.id,
    userIds: [receiveLike.senderId, receiveLike.receiverId],
  });

  await receiveLike.save();
  await messageRoom.save();
  await user.likeIndexCollection.update(receiveLike.indexData);
  await sender.likeIndexCollection.update(receiveLike.indexData);

  return sender;
};
