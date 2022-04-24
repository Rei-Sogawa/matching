import { addMinutes } from "date-fns";

import { Resolvers } from "./../../graphql/generated";

export const Me: Resolvers["Me"] = {};

export const User: Resolvers["User"] = {
  photoUrls: async (parent, _args, context) => {
    const { storage } = context;

    if (process.env.NODE_ENV !== "production") {
      return parent.photoPaths.map((path) => storage.bucket().file(path).publicUrl());
    }

    return parent.photoPaths.map((path) =>
      storage
        .bucket()
        .file(path)
        .getSignedUrl({ action: "read", expires: addMinutes(new Date(), 15) })
        .then((res) => res[0] as string)
    );
  },
};
