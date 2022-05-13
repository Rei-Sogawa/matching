import { Context } from "../../../context";
import { ViewerType } from "../../../resolvers/query";

export const receiveLikeUsersQuery = async (
  { uid }: ViewerType,
  __: unknown,
  { collections: { usersCollection, userLikeIndexCollection } }: Context
) => {
  const userIds = await userLikeIndexCollection.of(uid).pendingReceiveLikeUserIds();
  return Promise.all(userIds.map((id) => usersCollection.findOne(id)));
};
