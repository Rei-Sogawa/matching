import { Context } from "../../context";
import { UserDoc } from "../../fire/docs/user";
import { SignUpInput } from "../../graphql/generated";

export const signUpMutation = async (_: unknown, args: { input: SignUpInput }, context: Context) => {
  const { email, password } = args.input;
  const { usersCollection, userIndexCollection } = context.collections;
  const { firebase } = context;

  const { uid } = await firebase.auth.createUser({ email, password });

  const user = UserDoc.create(usersCollection, uid);
  await user.save();
  await userIndexCollection.add(user.toIndex());

  return user;
};
