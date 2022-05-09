import { last } from "lodash";

import { authorize } from "../../authorize";
import { Context } from "../../context";
import { PageInput } from "../../graphql/generated";

export const sendLikeUsersQuery = async (_: unknown, args: { input: PageInput }, context: Context) => {
  authorize(context);

  const { input } = args;
  const { uid } = context.auth;
  const { usersCollection, likeIndexCollection } = context.collections;

  const sendLikes = await likeIndexCollection.paginatedSendLikes({
    first: input.first,
    after: input.after,
    userId: uid,
  });

  const edges = await Promise.all(
    sendLikes.map(async (like) => {
      const node = await usersCollection.get(like.receiverId);
      return {
        node,
        cursor: like.createdAt,
      };
    })
  );

  return {
    edges,
    pageInfo: {
      endCursor: last(edges)?.cursor,
      hasNextPage: input.first === edges.length,
    },
  };
};
