import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { uid } = context;
    const { usersCollection } = context.collections;

    return usersCollection.findOneById(uid);
  },
};
