import { Context } from "../../../context";
import { QueryUserArgs } from "../../../graphql/generated";

export const userQuery = (_: unknown, { userId }: QueryUserArgs, { collections: { usersCollection } }: Context) => {
  return usersCollection.findOne(userId);
};
