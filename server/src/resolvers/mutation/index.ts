import { authorize } from "../../authorize";
import { UserDoc } from "../../fire/docs/user";
import { Resolvers } from "./../../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  async signUp(_parent, args, context) {
    const { email, password } = args.input;
    const { auth } = context;
    const { usersCollection, usersStatShards } = context.collections;

    const { uid } = await auth.createUser({ email, password });
    await usersStatShards.insert({ userIds: [uid] });
    const userData = UserDoc.create({
      gender: "MALE",
      nickName: "ニックネーム",
      age: 30,
      livingPref: "東京",
      photoPaths: [],
    });
    return usersCollection.insert({ id: uid, ...userData });
  },

  async updateUser(_parent, args, context) {
    authorize(context);

    const { authContext } = context;
    const { usersCollection } = context.collections;

    const user = await usersCollection.findOneById(authContext.uid);
    user.edit(args.input);
    return user.update();
  },
};
