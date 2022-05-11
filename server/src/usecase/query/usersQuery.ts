import { last } from "lodash";

import { authorize } from "../../authorize";
import { Context } from "../../context";
import { PageInput } from "../../graphql/generated";

export const usersQuery = async (_: unknown, args: { input: PageInput }, context: Context) => {
  authorize(context);

  const { input } = args;
  const { uid } = context.auth;
  const { usersCollection, userIndexCollection, likeIndexCollection } = context.collections;

  const sendLikes = await likeIndexCollection.sendLikes(uid);
  const receiveLikes = await likeIndexCollection.receiveLikes(uid);

  const users = await userIndexCollection.paginatedUsers({
    first: input.first,
    after: input.after,
    excludeUserIds: [uid, ...sendLikes.map((like) => like.receiverId), ...receiveLikes.map((like) => like.senderId)],
  });

  const nodes = await Promise.all(users.map((user) => usersCollection.findOne(user.id)));
  const edges = nodes.map((node) => ({ node, cursor: node.lastAccessedAt }));

  return {
    edges,
    pageInfo: {
      endCursor: last(edges)?.cursor,
      hasNextPage: input.first === edges.length,
    },
  };
};
