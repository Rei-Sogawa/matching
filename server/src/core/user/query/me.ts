import { authorize } from "../../../authorize";
import { Context } from "../../../context";

export const meQuery = async (_: unknown, __: unknown, { auth, collections: { usersCollection } }: Context) => {
  authorize(auth);

  return usersCollection.findOne(auth.uid);
};
