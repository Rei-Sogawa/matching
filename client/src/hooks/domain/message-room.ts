import { gql, Reference, useApolloClient } from "@apollo/client";
import { collection, getFirestore, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { useEffect } from "react";

import { useAuth } from "../../contexts/Auth";
import { useMe } from "../../contexts/Me";
import {
  useCreatedMessageLazyQuery,
  useCreateMessageMutation,
  useMessageRoomQuery,
  useMessageRoomsQuery,
  useUpdatedMessageRoomLazyQuery,
} from "../../graphql/generated";

// QUERY
gql`
  query MessageRooms($input: PageInput!) {
    viewer {
      id
      messageRooms(input: $input) {
        edges {
          node {
            id
            ...MessageRoomItem
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const useMessageRooms = () => {
  const QUERY_SIZE = 6;

  const { data, fetchMore } = useMessageRoomsQuery({ variables: { input: { first: QUERY_SIZE } } });

  const onLoadMore = async () => {
    await fetchMore({
      variables: { input: { first: QUERY_SIZE, after: data?.viewer.messageRooms.pageInfo.endCursor } },
    });
  };

  return { data, onLoadMore };
};

gql`
  query MessageRoom($messageRoomId: ID!, $input: PageInput!) {
    viewer {
      id
      messageRoom(messageRoomId: $messageRoomId) {
        id
        partner {
          id
          nickName
          topPhotoUrl
        }
        messages(input: $input) {
          edges {
            node {
              id
              ...MessageItem
            }
            cursor
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

export const useMessageRoom = (messageRoomId: string) => {
  const QUERY_SIZE = 20;

  const { data, fetchMore } = useMessageRoomQuery({ variables: { messageRoomId, input: { first: QUERY_SIZE } } });

  const onLoadMore = async () => {
    await fetchMore({
      variables: {
        id: messageRoomId,
        input: { first: QUERY_SIZE, after: data?.viewer.messageRoom.messages.pageInfo.endCursor },
      },
    });
  };

  return {
    data,
    onLoadMore,
  };
};

gql`
  query CreatedMessage($messageId: ID!) {
    viewer {
      id
      message(messageId: $messageId) {
        id
        ...MessageItem
      }
    }
  }
`;

export const useSubscribeMessage = (messageRoomId: string) => {
  const client = useApolloClient();

  const { me } = useMe();

  const [fetch] = useCreatedMessageLazyQuery();

  useEffect(() => {
    console.log("[matching] Listen Firestore messageRoomEvents to subscribe messages.");
    return onSnapshot(
      query(
        collection(getFirestore(), "messageRoomEvents"),
        where("userIds", "array-contains", me.id),
        where("messageRoomId", "==", messageRoomId),
        where("createdAt", ">=", Timestamp.now()),
        orderBy("createdAt", "desc")
      ),
      (snap) => {
        snap.docChanges().forEach(async (dc) => {
          const messageRoomId = dc.doc.data().messageRoomId;
          const messageId = dc.doc.data().messageId;

          const { data } = await fetch({ variables: { messageId } });
          if (!data) return;

          client.cache.modify({
            id: client.cache.identify({ __typename: "MessageRoom", id: messageRoomId }),
            fields: {
              messages(existing, { toReference }) {
                const edge = {
                  __typename: "MessageEdge",
                  node: toReference(data.viewer.message),
                  cursor: data.viewer.message.createdAt,
                };
                return { ...existing, edges: [edge, ...existing.edges] };
              },
            },
          });
        });
      }
    );
  }, []);
};

gql`
  query UpdatedMessageRoom($messageRoomId: ID!) {
    viewer {
      id
      messageRoom(messageRoomId: $messageRoomId) {
        id
        ...MessageRoomItem
      }
    }
  }
`;

export const useSubscribeMessageRooms = () => {
  const { uid } = useAuth();

  const client = useApolloClient();

  const [fetch] = useUpdatedMessageRoomLazyQuery();

  useEffect(() => {
    if (!uid) return;

    console.log("[matching] Listen Firestore messageRoomEvents to subscribe messageRooms.");
    return onSnapshot(
      query(
        collection(getFirestore(), "messageRoomEvents"),
        where("userIds", "array-contains", uid),
        where("createdAt", ">=", Timestamp.now()),
        orderBy("createdAt", "desc")
      ),
      (snap) => {
        snap.docChanges().forEach(async (dc) => {
          const messageRoomId = dc.doc.data().messageRoomId;

          const { data } = await fetch({ variables: { messageRoomId } });
          if (!data) return;

          client.cache.modify({
            id: client.cache.identify({ __typename: "Viewer", id: uid }),
            fields: {
              messageRooms(existing, { readField, toReference }) {
                const edge = {
                  __typename: "MessageRoomEdge",
                  node: toReference(data.viewer.messageRoom),
                  cursor: new Date().toISOString(),
                };

                const hasCache = existing.edges.some(
                  ({ node }: { node: Reference }) => readField("id", node) === messageRoomId
                );

                if (hasCache) {
                  const filtered = existing.edges.filter(
                    ({ node }: { node: Reference }) => readField("id", node) !== messageRoomId
                  );

                  return {
                    ...existing,
                    edges: [edge, ...filtered],
                  };
                }

                return {
                  ...existing,
                  edges: [edge, ...existing.edges],
                };
              },
            },
          });
        });
      }
    );
  }, []);
};

// MUTATION
gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      ...MessageItem
    }
  }
`;

export const useCreateMessage = (messageRoomId: string) => {
  const [mutate] = useCreateMessageMutation();

  const createMessage = async (content: string) => {
    await mutate({ variables: { input: { messageRoomId, content } } });
  };

  return { createMessage };
};
