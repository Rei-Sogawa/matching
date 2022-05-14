import { last } from "lodash";

import { Context } from "../../../context";
import { ViewerSkipLikeUsersArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const skipLikeUsersQuery = async (
  { uid }: ViewerType,
  { input }: ViewerSkipLikeUsersArgs,
  { collections: { usersCollection, userLikeIndexCollection } }: Context
) => {
  const likes = await userLikeIndexCollection.of(uid).paginatedSkipLikes({
    first: input.first,
    after: input.after,
  });
  const users = await Promise.all(likes.map((l) => usersCollection.findOne(l.senderId)));

  const edges = users.map((u, i) => ({ node: u, cursor: likes[i].createdAt }));

  return { edges, pageInfo: { hasNextPage: input.first === edges.length, endCursor: last(edges)?.cursor } };
};
