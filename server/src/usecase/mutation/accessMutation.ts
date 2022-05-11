import { authorize } from "../../authorize";
import { Context } from "../../context";

export const accessMutation = async (_: unknown, __: unknown, context: Context) => {
  authorize(context);

  const { uid } = context.auth;
  const { usersCollection, userIndexCollection } = context.collections;

  const user = await usersCollection.get(uid);
  await user.access().save();
  await userIndexCollection.update(user.toIndex);

  return user;
};
