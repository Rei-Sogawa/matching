import { filter, includes, last, map, orderBy, take, toPairs } from "lodash";

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

    const likeIndex = await likeIndexShardsCollection.getIndex();

    const sendLikeUserIds = await Promise.resolve(likeIndex)
      .then((likeIndex) => toPairs(likeIndex))
      .then((pairs) => filter(pairs, ([, data]) => data.senderId === uid))
      .then((pairs) => map(pairs, ([, data]) => data.receiverId));

    const userIds = await userIndexShardsCollection
      .getIndex()
      .then((userIndex) => toPairs(userIndex))
      .then((pairs) => orderBy(pairs, ([, data]) => data.lastAccessedAt, "desc"))
      .then((pairs) => filter(pairs, ([, data]) => (input.after ? input.after > data.lastAccessedAt : true)))
      .then((pairs) => filter(pairs, ([id]) => !includes(sendLikeUserIds, id)))
      .then((pairs) => take(pairs, input.first))
      .then((pairs) => map(pairs, ([id]) => id));

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
