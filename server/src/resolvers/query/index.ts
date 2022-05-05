import { last } from "lodash";

import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(uid);
  },

  user: (_parent, args, context) => {
    authorize(context);

    const { id } = args;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(id);
  },

  users: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { usersCollection, userIndexShardsCollection, likeIndexShardsCollection } = context.collections;

    const sendLikeUserIds = await likeIndexShardsCollection.sendLikeUserIds(uid);
    const userIds = await userIndexShardsCollection.userIds({
      first: input.first,
      after: input.after,
      sendLikeUserIds,
    });

    const nodes = await Promise.all(userIds.map((id) => usersCollection.findOneById(id)));
    const edges = nodes.map((node) => ({ node, cursor: node.lastAccessedAt }));

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === userIds.length,
      },
    };
  },
};
