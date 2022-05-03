import { shuffle, take, xor } from "lodash";

import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(uid);
  },

  randomUsers: async (_parent, args, context) => {
    authorize(context);

    const { size, excludeIds } = args.input;
    const { uid } = context.decodedIdToken;
    const { allUsersStatsCollection, usersCollection } = context.collections;

    const allUsersStat = await allUsersStatsCollection.get();
    const randomUserIds = take(shuffle(xor(allUsersStat.userIds, excludeIds, [uid])), size);

    return randomUserIds.map((id) => usersCollection.findOneById(id));
  },

  user: (_parent, args, context) => {
    authorize(context);

    const { id } = args;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(id);
  },
};
