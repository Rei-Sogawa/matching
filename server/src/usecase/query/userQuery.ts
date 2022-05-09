import { authorize } from "../../authorize";
import { Context } from "../../context";

export const userQuery = (_: unknown, args: { id: string }, context: Context) => {
  authorize(context);

  const { id } = args;
  const { usersCollection } = context.collections;

  return usersCollection.get(id);
};
