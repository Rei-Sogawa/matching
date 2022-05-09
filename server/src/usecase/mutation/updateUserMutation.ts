import { authorize } from "../../authorize";
import { Context } from "../../context";
import { UpdateUserInput } from "../../graphql/generated";

export const updateUserMutation = async (_: unknown, args: { input: UpdateUserInput }, context: Context) => {
  authorize(context);

  const { uid } = context.auth;
  const { usersCollection, userIndexCollection } = context.collections;

  const user = await usersCollection.get(uid);
  await user.edit(args.input).save();
  await userIndexCollection.update(user.toIndex());

  return user;
};
