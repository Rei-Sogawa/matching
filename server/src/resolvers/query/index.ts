import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { authContext } = context;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(authContext.uid);
  },

  users: (_parent, _args, context) => {
    authorize(context);

    const { usersCollection } = context.collections;

    return usersCollection.findManyByQuery((ref) => ref.orderBy("createdAt", "desc"));
  },
};
