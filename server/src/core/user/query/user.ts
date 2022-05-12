import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { QueryUserArgs } from "../../../graphql/generated";

export const userQuery = (
  _: unknown,
  { userId }: QueryUserArgs,
  { auth, collections: { usersCollection } }: Context
) => {
  authorize(auth);

  return usersCollection.findOne(userId);
};
