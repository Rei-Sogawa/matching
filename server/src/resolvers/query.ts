import { authorize } from "../authorize";
import { Resolvers } from "../graphql/generated";

export type ViewerType = {
  id: string;
  uid: string;
};

export const Query: Resolvers["Query"] = {
  viewer: (_: unknown, __: unknown, { auth }) => {
    authorize(auth);
    return { id: auth.uid, uid: auth.uid };
  },
};
