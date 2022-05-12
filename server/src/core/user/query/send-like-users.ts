import { last } from "lodash";

import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { QuerySendLikeUsersArgs } from "../../../graphql/generated";

export const sendLikeUsersQuery = async (
  _: unknown,
  { input }: QuerySendLikeUsersArgs,
  { auth, collections: { usersCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);
  const userIds = await user.likeIndexCollection.paginatedPendingSendLikeUserIds({
    first: input.first,
    after: input.after,
  });
  const users = await Promise.all(userIds.map((id) => usersCollection.findOne(id)));

  const edges = users.map((u) => ({ node: u, cursor: u.createdAt }));

  return { edges, pageInfo: { hasNextPage: input.first === edges.length, endCursor: last(edges)?.cursor } };
};
