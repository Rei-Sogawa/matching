import { Resolvers } from "./../../graphql/generated";

export const Me: Resolvers["Me"] = {};

export const User: Resolvers["User"] = {
  photoUrls: async (parent, _args, context) => {
    const { storage } = context;
    return parent.photoPaths.map((path) => storage.bucket().file(path).publicUrl());
  },
};
