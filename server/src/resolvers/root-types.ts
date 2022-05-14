import { head, last } from "lodash";

import { messageQuery } from "../core/message-room/query/message";
import { messageRoomQuery } from "../core/message-room/query/message-room";
import { messageRoomsQuery } from "../core/message-room/query/message-rooms";
import { meQuery } from "../core/user/query/me";
import { receiveLikeUsersQuery } from "../core/user/query/receive-like-users";
import { sendLikeUsersQuery } from "../core/user/query/send-like-users";
import { userQuery } from "../core/user/query/user";
import { usersQuery } from "../core/user/query/users";
import { MessageDoc } from "../fire/docs/message";
import { Resolvers } from "../graphql/generated";
import { assertDefined } from "../utils/assert-defined";
import { getSignedUrl } from "../utils/get-signed-url";

export const Viewer: Resolvers["Viewer"] = {
  me: meQuery,
  user: userQuery,
  users: usersQuery,
  receiveLikeUsers: receiveLikeUsersQuery,
  sendLikeUsers: sendLikeUsersQuery,

  messageRooms: messageRoomsQuery,
  messageRoom: messageRoomQuery,
  message: messageQuery,
};

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
    const { usersCollection } = context.collections;
    return usersCollection.findOne(parent.partnerId(context.auth.uid));
  },

  messages: async (parent, args) => {
    const { input } = args;
    const messages = await parent.messagesCollection.paginatedMessages({ first: input.first, after: input.after });
    const edges = messages.map((m) => ({ node: m, cursor: m.createdAt }));
    return { edges, pageInfo: { endCursor: last(edges)?.cursor, hasNextPage: input.first === edges.length } };
  },

  latestMessage: async (parent, _args, context) => {
    const latest = await parent.messagesCollection.latest();
    if (latest) return latest;

    assertDefined(context.auth);
    return MessageDoc.createLatestMessageAlternative(parent.messagesCollection, {
      userId: context.auth.uid,
      createdAt: parent.createdAt,
    });
  },
};

export const Message: Resolvers["Message"] = {
  user: async (parent, _args, context) => {
    const { usersCollection } = context.collections;
    return usersCollection.findOne(parent.userId);
  },

  mine: async (parent, _args, context) => {
    assertDefined(context.auth);
    return parent.userId === context.auth.uid;
  },
};
