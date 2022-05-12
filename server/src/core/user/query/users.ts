import { last } from "lodash";

import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { QueryUsersArgs } from "../../../graphql/generated";

export const usersQuery = async (
  _: unknown,
  { input }: QueryUsersArgs,
  { auth, collections: { usersCollection, userIndexCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);
  const userIds = await userIndexCollection.paginatedUserIds({
    first: input.first,
    after: input.after,
    excludeUserIds: [
      auth.uid,
      ...(await user.likeIndexCollection.sendLikeUserIds()),
      ...(await user.likeIndexCollection.receiveLikeUserIds()),
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
