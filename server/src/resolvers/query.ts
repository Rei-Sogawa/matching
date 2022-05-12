import { messageQuery } from "../core/message-room/query/message";
import { messageRoomQuery } from "../core/message-room/query/message-room";
import { newMessageRoomsQuery } from "../core/message-room/query/new-message-rooms";
import { openedMessageRooms } from "../core/message-room/query/opened-message-rooms";
import { meQuery } from "../core/user/query/me";
import { receiveLikeUsersQuery } from "../core/user/query/receive-like-users";
import { sendLikeUsersQuery } from "../core/user/query/send-like-users";
import { userQuery } from "../core/user/query/user";
import { usersQuery } from "../core/user/query/users";
import { Resolvers } from "../graphql/generated";

export const Query: Resolvers["Query"] = {
  me: meQuery,
  user: userQuery,
  users: usersQuery,
  receiveLikeUsers: receiveLikeUsersQuery,
  sendLikeUsers: sendLikeUsersQuery,

  newMessageRooms: newMessageRoomsQuery,
  openedMessageRooms: openedMessageRooms,
  messageRoom: messageRoomQuery,
  message: messageQuery,
};
