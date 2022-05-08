import { Firestore } from "firebase-admin/firestore";

import { LikeIndexCollection } from "./collections/like-index";
import { LikesCollection } from "./collections/likes";
import { MessageRoomEventsCollection } from "./collections/message-room-events";
import { MessageRoomsCollection } from "./collections/message-rooms";
import { MessagesGroupCollection } from "./collections/messages-group";
import { UserIndexCollection } from "./collections/user-index";
import { UsersCollection } from "./collections/users";

export const createCollections = (db: Firestore) => {
  const usersRef = db.collection("users");
  const likesRef = db.collection("likes");
  const messageRoomsRef = db.collection("messageRooms");
  const messagesGroupRef = db.collectionGroup("messages");

  const userIndexRef = db.collection("userIndex");
  const likeIndexRef = db.collection("likeIndex");

  const messageRoomEventsRef = db.collection("messageRoomEvents");

  const usersCollection = new UsersCollection(usersRef);
  const likesCollection = new LikesCollection(likesRef);
  const messageRoomsCollection = new MessageRoomsCollection(messageRoomsRef);
  const messagesGroupCollection = new MessagesGroupCollection(messagesGroupRef);

  const userIndexCollection = new UserIndexCollection(userIndexRef);
  const likeIndexCollection = new LikeIndexCollection(likeIndexRef);

  const messageRoomEventsCollection = new MessageRoomEventsCollection(messageRoomEventsRef);

  return {
    usersCollection,
    likesCollection,
    messageRoomsCollection,
    messagesGroupCollection,
    userIndexCollection,
    likeIndexCollection,
    messageRoomEventsCollection,
  };
};

export type Collections = ReturnType<typeof createCollections>;
