import { addMinutes } from "date-fns";
import { Storage } from "firebase-admin/storage";

import { Resolvers } from "./../../graphql/generated";

const getSignedUrl = (storage: Storage, path: string) =>
  storage
    .bucket()
    .file(path)
    .getSignedUrl({ action: "read", expires: addMinutes(new Date(), 15) })
    .then((res) => res[0] as string);

export const Me: Resolvers["Me"] = {
  topPhotoUrl: async (parent, _args, context) => {
    const { storage } = context;
    return parent.photoPaths.length > 0 ? getSignedUrl(storage, parent.photoPaths[0]) : null;
  },
  photoUrls: async (parent, _args, context) => {
    const { storage } = context;
    return Promise.all(parent.photoPaths.map((photoPath) => getSignedUrl(storage, photoPath)));
  },
};

export const User: Resolvers["User"] = {
  topPhotoUrl: async (parent, _args, context) => {
    const { storage } = context;
    return parent.photoPaths.length > 0 ? getSignedUrl(storage, parent.photoPaths[0]) : null;
  },
  photoUrls: async (parent, _args, context) => {
    const { storage } = context;
    return Promise.all(parent.photoPaths.map((photoPath) => getSignedUrl(storage, photoPath)));
  },
};
