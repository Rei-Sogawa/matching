import { last } from "lodash";

import { Context } from "../../../context";
import { QueryUsersArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const usersQuery = async (
  { uid }: ViewerType,
  { input }: QueryUsersArgs,
  { collections: { usersCollection, userIndexCollection, userLikeIndexCollection } }: Context
) => {
  const userIds = await userIndexCollection.paginatedUserIds({
    first: input.first,
    after: input.after,
    excludeUserIds: [
      uid,
      ...(await userLikeIndexCollection.of(uid).sendLikeUserIds()),
      ...(await userLikeIndexCollection.of(uid).receiveLikeUserIds()),
    ],
  });
  const users = await Promise.all(userIds.map((id) => usersCollection.findOne(id)));

  const edges = users.map((u) => ({ node: u, cursor: u.lastAccessedAt }));

  return {
    edges,
    pageInfo: {
      hasNextPage: input.first === edges.length,
      endCursor: last(edges)?.cursor,
    },
  };
};
