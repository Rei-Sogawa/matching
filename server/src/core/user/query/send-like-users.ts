import { last } from "lodash";

import { Context } from "../../../context";
import { ViewerSendLikeUsersArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const sendLikeUsersQuery = async (
  { uid }: ViewerType,
  { input }: ViewerSendLikeUsersArgs,
  { collections: { usersCollection, userLikeIndexCollection } }: Context
) => {
  const userIds = await userLikeIndexCollection.of(uid).paginatedPendingSendLikeUserIds({
    first: input.first,
    after: input.after,
  });
  const users = await Promise.all(userIds.map((id) => usersCollection.findOne(id)));

  const edges = users.map((u) => ({ node: u, cursor: u.createdAt }));

  return { edges, pageInfo: { hasNextPage: input.first === edges.length, endCursor: last(edges)?.cursor } };
};
