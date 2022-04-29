import { getSignedUrl } from "../../utils/get-signed-url";
import { Resolvers } from "./../../graphql/generated";

export const Me: Resolvers["Me"] = {
  photoUrls: async (parent, _args, context) => {
    const { storage } = context;
    return parent.photoPaths.map((path) => getSignedUrl(storage, path));
  },
};

export const User: Resolvers["User"] = {
  photoUrls: async (parent, _args, context) => {
    const { storage } = context;
    return parent.photoPaths.map((path) => getSignedUrl(storage, path));
  },
};
