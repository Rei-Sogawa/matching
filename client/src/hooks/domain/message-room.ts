import { gql, useApolloClient } from "@apollo/client";
import { collection, getFirestore, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { useEffect } from "react";

import { useMe } from "../../contexts/Me";
import {
  useCreatedMessageLazyQuery,
  useCreateMessageMutation,
  useMessageRoomQuery,
  useMessageRoomsQuery,
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

// export const useSubscribeMessageRooms = () => {
//   const { me } = useMe();

//   useEffect(() => {
//     return onSnapshot(
//       query(
//         collection(getFirestore(), "messageRoomEvents"),
//         where("userIds", "array-contains", me.id),
//         where("createdAt", ">=", Timestamp.now()),
//         orderBy("createdAt", "desc")
//       ),
//       (snap) => {
//         snap.docChanges().forEach(async (dc) => {
//           const messageRoomId = dc.doc.data().messageRoomId;
//         });
//       }
//     );
//   }, []);
// };

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
