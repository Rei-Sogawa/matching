import { Firestore } from "firebase-admin/firestore";

import { LikesCollection } from "./collections/likes";
import { MessageRoomEventsCollection } from "./collections/message-room-events";
import { MessageRoomsCollection } from "./collections/message-rooms";
import { MessagesGroupCollection } from "./collections/messages-group";
import { UserIndexCollection } from "./collections/user-index";
import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const usersCollection = new UsersCollection(db.collection("users"));
  const likesCollection = new LikesCollection(db.collection("likes"));
  const messageRoomsCollection = new MessageRoomsCollection(db.collection("messageRooms"));
  const messagesCollectionGroup = new MessagesGroupCollection(db.collectionGroup("messages"));

  const userIndexCollection = new UserIndexCollection(db.collection("userIndex"));

  const messageRoomEventsCollection = new MessageRoomEventsCollection(db.collection("messageRoomEvents"));

  return {
    usersCollection,
    likesCollection,
    messageRoomsCollection,
    messagesCollectionGroup,
    userIndexCollection,
    messageRoomEventsCollection,
  };
};

export type Collections = ReturnType<typeof createCollections>;
