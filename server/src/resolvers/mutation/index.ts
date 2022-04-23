import { authorize } from "../../authorize";
import { UserDoc } from "../../fire/docs/user";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { displayName, email, password } = args.input;
    const { auth } = context;
    const { usersCollection } = context.collections;

    const { uid } = await auth.createUser({ displayName, email, password });

    const userData = UserDoc.createData({ displayName, photoPaths: [] });
    return usersCollection.insert({ id: uid, ...userData });
  },

  async updateUser(_parent, args, context) {
    authorize(context);

    const { photoPaths, displayName } = args.input;
    const { usersCollection } = context.collections;

    const user = await usersCollection.findOneById(context.uid);
    user.edit({ displayName, photoPaths });
    return user.update();
  },
};
