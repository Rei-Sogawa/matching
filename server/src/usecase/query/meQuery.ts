import { authorize } from "../../authorize";
import { Context } from "../../context";

export const meQuery = (_: unknown, __: unknown, context: Context) => {
  authorize(context);

  const { uid } = context.auth;
  const { usersCollection } = context.collections;

  return usersCollection.get(uid);
};
