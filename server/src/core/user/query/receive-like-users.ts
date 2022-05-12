import { authorize } from "../../../authorize";
import { Context } from "../../../context";

export const receiveLikeUsersQuery = async (
  _: unknown,
  __: unknown,
  { auth, collections: { usersCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);
  const userIds = await user.likeIndexCollection.pendingReceiveLikeUserIds();

  return Promise.all(userIds.map((id) => usersCollection.findOne(id)));
};
