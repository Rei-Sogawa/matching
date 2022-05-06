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

    const sendLikes = await likeIndexShardsCollection.sendLikes(uid);
    const userIds = await userIndexShardsCollection.paginatedUserIds({
      userId: uid,
      first: input.first,
      after: input.after,
      sendLikeUserIds: sendLikes.map(([, data]) => data.receiverId),
    });

    const nodes = await Promise.all(userIds.map((id) => usersCollection.findOneById(id)));
    const edges = nodes.map((node) => ({ node, cursor: node.lastAccessedAt }));

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === edges.length,
      },
    };
  },

  sendLikeUsers: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { usersCollection, likeIndexShardsCollection } = context.collections;

    const sendLikes = await likeIndexShardsCollection.paginatedSendLikes({
      userId: uid,
      first: input.first,
      after: input.after,
    });

    const edges = await Promise.all(
      sendLikes.map(async ([, data]) => {
        const node = await usersCollection.findOneById(data.receiverId);
        return {
          node,
          cursor: data.createdAt,
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
  },
};
