import { authorize } from "../../../authorize";
import { Context } from "../../../context";

export const receiveLikeUsersQuery = async (
  _: unknown,
  __: unknown,
  { auth, collections: { usersCollection, userLikeIndexCollection } }: Context
) => {
  authorize(auth);

  const userIds = await userLikeIndexCollection.of(auth.uid).pendingReceiveLikeUserIds();

  return Promise.all(userIds.map((id) => usersCollection.findOne(id)));
};
