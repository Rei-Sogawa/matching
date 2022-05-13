import { Context } from "../../../context";
import { ViewerUserArgs } from "../../../graphql/generated";

export const userQuery = (_: unknown, { userId }: ViewerUserArgs, { collections: { usersCollection } }: Context) => {
  return usersCollection.findOne(userId);
};
