import { Resolvers } from "../graphql/generated";
import { meQuery } from "../usecase/query/meQuery";
import { messageQuery } from "../usecase/query/messageQuery";
import { messageRoomQuery } from "../usecase/query/messageRoomQuery";
import { messageRoomsQuery } from "../usecase/query/messageRoomsQuery";
import { newMessageRoomsQuery } from "../usecase/query/newMessageRoomsQuery";
import { receiveLikeUsersQuery } from "../usecase/query/receiveLikeUsersQuery";
import { sendLikeUsersQuery } from "../usecase/query/sendLikeUsersQuery";
import { userQuery } from "../usecase/query/userQuery";
import { usersQuery } from "../usecase/query/usersQuery";

export const Query: Resolvers["Query"] = {
  me: meQuery,
  user: userQuery,
  users: usersQuery,
  receiveLikeUsers: receiveLikeUsersQuery,
  sendLikeUsers: sendLikeUsersQuery,
  newMessageRooms: newMessageRoomsQuery,
  messageRooms: messageRoomsQuery,
  messageRoom: messageRoomQuery,
  message: messageQuery,
};
