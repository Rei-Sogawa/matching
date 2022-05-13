import { authorize } from "../authorize";
import { Resolvers } from "../graphql/generated";

export type ViewerType = {
  uid: string;
};

export const Query: Resolvers["Query"] = {
  viewer: (_: unknown, __: unknown, { auth }) => {
    authorize(auth);
    return { uid: auth.uid };
  },
};
