import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { onUpdateUser } from "../../../psuedo-trigger/user";

export const updateUserLastAccessMutation = async (
  _: unknown,
  __: unknown,
  { auth, collections: { usersCollection, userIndexCollection } }: Context
) => {
  authorize(auth);

  const user = await usersCollection.findOne(auth.uid);

  user.access();

  await user.save();
  await onUpdateUser(user, { userIndexCollection });

  return user;
};
