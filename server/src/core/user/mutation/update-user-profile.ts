import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { MutationUpdateUserProfileArgs } from "../../../graphql/generated";

export const updateUserProfileMutation = async (
  _: unknown,
  { input }: MutationUpdateUserProfileArgs,
  { auth, collections: { usersCollection, userIndexCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);

  user.edit(input);

  await user.save();
  await userIndexCollection.update(user.indexData);

  return user;
};
