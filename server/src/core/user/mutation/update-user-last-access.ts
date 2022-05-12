import { authorize } from "../../../authorize";
import { Context } from "../../../context";

export const updateUserLastAccessMutation = async (
  _: unknown,
  __: unknown,
  { auth, collections: { usersCollection, userIndexCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);

  user.access();

  await user.save();
  await userIndexCollection.update(user.indexData);

  return user;
};
