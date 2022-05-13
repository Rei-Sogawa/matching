import { Context } from "../../../context";
import { ViewerType } from "../../../resolvers/query";

export const meQuery = async ({ uid }: ViewerType, __: unknown, { collections: { usersCollection } }: Context) => {
  return usersCollection.findOne(uid);
};
