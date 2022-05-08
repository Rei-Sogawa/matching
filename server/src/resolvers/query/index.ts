import { last } from "lodash";

import { authorize } from "../../authorize";
import { Resolvers } from "../../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: (_parent, _args, context) => {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection } = context.collections;

    return usersCollection.get(uid);
  },

  user: (_parent, args, context) => {
    authorize(context);

    const { id } = args;
    const { usersCollection } = context.collections;

    return usersCollection.get(id);
  },

  users: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { usersCollection, userIndexCollection, likeIndexCollection } = context.collections;

    const sendLikes = await likeIndexCollection.sendLikes(uid);
    const receiveLikes = await likeIndexCollection.receiveLikes(uid);

    const users = await userIndexCollection.paginatedUsers({
      first: input.first,
      after: input.after,
      excludeUserIds: [uid, ...sendLikes.map((like) => like.receiverId), ...receiveLikes.map((like) => like.senderId)],
    });

    const nodes = await Promise.all(users.map((user) => usersCollection.get(user.id)));
    const edges = nodes.map((node) => ({ node, cursor: node.lastAccessedAt }));

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === edges.length,
      },
    };
  },

  receiveLikeUsers: async (_parent, args, context) => {
    authorize(context);

    const { uid } = context.decodedIdToken;
    const { usersCollection, likeIndexCollection } = context.collections;

    const receiveLikes = await likeIndexCollection.receivePendingLikes(uid);

    return Promise.all(receiveLikes.map((data) => usersCollection.get(data.senderId)));
  },

  sendLikeUsers: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { usersCollection, likeIndexCollection } = context.collections;

    const sendLikes = await likeIndexCollection.paginatedSendLikes({
      first: input.first,
      after: input.after,
      userId: uid,
    });

    const edges = await Promise.all(
      sendLikes.map(async (like) => {
        const node = await usersCollection.get(like.receiverId);
        return {
          node,
          cursor: like.createdAt,
        };
      })
    );

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === edges.length,
      },
    };
  },

  newMessageRooms: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { messageRoomsCollection } = context.collections;

    const messageRooms = await messageRoomsCollection.paginatedNewMessageRooms({
      first: input.first,
      after: input.after,
      userId: uid,
    });

    const edges = messageRooms.map((mr) => ({ node: mr, cursor: mr.createdAt }));

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === edges.length,
      },
    };
  },

  messageRooms: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { messageRoomsCollection } = context.collections;

    const messageRooms = await messageRoomsCollection.paginatedMessageRooms({
      first: input.first,
      after: input.after,
      userId: uid,
    });

    const edges = messageRooms.map((mr) => ({ node: mr, cursor: mr.createdAt }));

    return {
      edges,
      pageInfo: {
        endCursor: last(edges)?.cursor,
        hasNextPage: input.first === edges.length,
      },
    };
  },

  messageRoom: async (_parent, args, context) => {
    authorize(context);

    const { id } = args;
    const { uid } = context.decodedIdToken;
    const { messageRoomsCollection } = context.collections;

    const messageRoom = await messageRoomsCollection.get(id);

    if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

    return messageRoom;
  },

  message: async (_parent, args, context) => {
    authorize(context);

    const { input } = args;
    const { uid } = context.decodedIdToken;
    const { messageRoomsCollection } = context.collections;

    const messageRoom = await messageRoomsCollection.get(input.messageRoomId);

    if (!messageRoom.isMember(uid)) throw new Error("not messageRoom member");

    return messageRoom.messages.get(input.messageId);
  },
};
