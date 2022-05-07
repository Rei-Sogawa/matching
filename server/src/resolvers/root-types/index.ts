import { last } from "lodash";

import { assertDefined } from "../../utils/assert-defined";
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

export const MessageRoom: Resolvers["MessageRoom"] = {
  partner: async (parent, _args, context) => {
    assertDefined(context.decodedIdToken);
    const { uid } = context.decodedIdToken;
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
};
