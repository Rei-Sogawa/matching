import { head, last } from "lodash";

import { Resolvers } from "../graphql/generated";
import { assertDefined } from "../utils/assert-defined";
import { getSignedUrl } from "../utils/get-signed-url";

export const Me: Resolvers["Me"] = {
  photoUrls: async (parent, _args, context) => {
    const { storage } = context.firebase;
    return parent.photoPaths.map((path) => getSignedUrl(storage, path));
  },
};

export const User: Resolvers["User"] = {
  photoUrls: async (parent, _args, context) => {
    const { storage } = context.firebase;
    return parent.photoPaths.map((path) => getSignedUrl(storage, path));
  },

  topPhotoUrl: async (parent, _args, context) => {
    const { storage } = context.firebase;
    const top = head(parent.photoPaths);
    return top ? getSignedUrl(storage, top) : null;
  },
};

export const MessageRoom: Resolvers["MessageRoom"] = {
  partner: async (parent, _args, context) => {
    assertDefined(context.auth);
    const { uid } = context.auth;
    const { usersCollection } = context.collections;
    return usersCollection.get(parent.partnerId(uid));
  },

  messages: async (parent, args) => {
    const { input } = args;
    const messages = await parent.messages.paginatedMessages({ first: input.first, after: input.after });
    const edges = messages.map((m) => ({ node: m, cursor: m.createdAt }));
    return { edges, pageInfo: { endCursor: last(edges)?.cursor, hasNextPage: input.first === edges.length } };
  },

  lastMessage: async (parent) => {
    return parent.messages.last();
  },
};

export const Message: Resolvers["Message"] = {
  user: async (parent, _args, context) => {
    const { usersCollection } = context.collections;
    return usersCollection.get(parent.userId);
  },

  mine: async (parent, _args, context) => {
    assertDefined(context.auth);
    return parent.userId === context.auth.uid;
  },
};
