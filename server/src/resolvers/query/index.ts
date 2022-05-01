import { shuffle, take, xor } from "lodash";

import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { authContext } = context;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(authContext.uid);
  },

  randomUsers: async (_parent, args, context) => {
    authorize(context);

    const { size, excludeIds } = args.input;
    const { usersCollection, usersStatShards } = context.collections;

    const usersStat = await usersStatShards.get();
    const randomUserIds = take(shuffle(xor(usersStat.userIds, excludeIds)), size);

    return randomUserIds.map((id) => usersCollection.findOneById(id));
  },
};
