import { Firestore } from "firebase-admin/firestore";

import { LikesCollection } from "./collections/likes";
import { MessageRoomEventsCollection } from "./collections/message-room-events";
import { MessageRoomsCollection } from "./collections/message-rooms";
import { MessagesGroupCollection } from "./collections/messages-group";
import { UsersCollection } from "./collections/users";
import { UserIndexCollection } from "./index/user-index";
import { UserLikeIndexCollection } from "./index/user-like-index";

export const createCollections = (db: Firestore) => {
  // ROOT
  const usersCollection = new UsersCollection(db.collection("users"));
  const likesCollection = new LikesCollection(db.collection("likes"));
  const messageRoomsCollection = new MessageRoomsCollection(db.collection("messageRooms"));
  // GROUP
  const messagesCollectionGroup = new MessagesGroupCollection(db.collectionGroup("messages"));
  // EVENT
  const messageRoomEventsCollection = new MessageRoomEventsCollection(db.collection("messageRoomEvents"));
  // INDEX
  const userIndexCollection = new UserIndexCollection(db.collection("userIndex"));
  const userLikeIndexCollection = new UserLikeIndexCollection(db.collection("users"));

  return {
    usersCollection,
    likesCollection,
    messageRoomsCollection,
    messagesCollectionGroup,
    messageRoomEventsCollection,
    userIndexCollection,
    userLikeIndexCollection,
  };
};

export type Collections = ReturnType<typeof createCollections>;
