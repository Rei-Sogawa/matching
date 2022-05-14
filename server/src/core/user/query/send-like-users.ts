import { last } from "lodash";

import { Context } from "../../../context";
import { ViewerSendLikeUsersArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const sendLikeUsersQuery = async (
  { uid }: ViewerType,
  { input }: ViewerSendLikeUsersArgs,
  { collections: { usersCollection, userLikeIndexCollection } }: Context
) => {
  const likes = await userLikeIndexCollection.of(uid).paginatedPendingSendLikes({
    first: input.first,
    after: input.after,
  });
  const users = await Promise.all(likes.map((l) => usersCollection.findOne(l.receiverId)));

  const edges = users.map((u, i) => ({ node: u, cursor: likes[i].createdAt }));

  return { edges, pageInfo: { hasNextPage: input.first === edges.length, endCursor: last(edges)?.cursor } };
};
