import { last } from "lodash";

import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection } = context.collections;

    return usersCollection.get(uid);
  },

  user: (_parent, args, context) => {
    authorize(context);

    const { id } = args;
    const { usersCollection } = context.collections;

    return usersCollection.get(id);
  },

  users: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { usersCollection, userIndexCollection, likeIndexCollection } = context.collections;

    const sendLikes = await likeIndexCollection.sendLikes(uid);
    const receiveLikes = await likeIndexCollection.receiveLikes(uid);

    const users = await userIndexCollection.paginatedUsers({
      first: input.first,
      after: input.after,
      excludeUserIds: [uid, ...sendLikes.map((like) => like.receiverId), ...receiveLikes.map((like) => like.senderId)],
    });

    const nodes = await Promise.all(users.map((user) => usersCollection.get(user.id)));
    const edges = nodes.map((node) => ({ node, cursor: node.lastAccessedAt }));

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === edges.length,
      },
    };
  },

  receiveLikeUsers: async (_parent, args, context) => {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection, likeIndexCollection } = context.collections;

    const receiveLikes = await likeIndexCollection.receiveLikes(uid);

    return Promise.all(receiveLikes.map((data) => usersCollection.get(data.senderId)));
  },

  sendLikeUsers: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { usersCollection, likeIndexCollection } = context.collections;

    const sendLikes = await likeIndexCollection.paginatedSendLikes({
      userId: uid,
      first: input.first,
      after: input.after,
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
  },
};
