import { authorize } from "../../authorize";
import { Context } from "../../context";

export const receiveLikeUsersQuery = async (_: unknown, __: unknown, context: Context) => {
  authorize(context);

  const { uid } = context.auth;
  const { usersCollection, likeIndexCollection } = context.collections;

  const receiveLikes = await likeIndexCollection.pendingReceiveLikes(uid);

  return Promise.all(receiveLikes.map((data) => usersCollection.get(data.senderId)));
};
