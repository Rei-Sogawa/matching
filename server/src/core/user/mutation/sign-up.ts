import { Context } from "../../../context";
import { UserDoc } from "../../../fire/docs/user";
import { MutationSignUpArgs } from "../../../graphql/generated";

export const signUpMutation = async (
  _: unknown,
  { input: { email, password } }: MutationSignUpArgs,
  { collections: { usersCollection, userIndexCollection }, firebase }: Context
): Promise<UserDoc> => {
  const { uid } = await firebase.auth.createUser({ email, password });

  const user = UserDoc.create(usersCollection, uid);

  await user.save();
  await userIndexCollection.add(user.indexData);

  return user;
};
