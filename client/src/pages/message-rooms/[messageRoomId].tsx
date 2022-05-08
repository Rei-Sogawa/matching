import { gql, useApolloClient } from "@apollo/client";
import { Avatar, Box, HStack, IconButton, Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import { collection, getFirestore, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import { FC, FormEventHandler, useEffect } from "react";
import { BiSend } from "react-icons/bi";
import { useParams } from "react-router-dom";

import { AutoResizeTextarea } from "../../components/base/AutoResizeTextarea";
import { BackButton } from "../../components/common/BackButton";
import {
  MessageItemFragment,
  useCreateMessageMutation,
  useMessageLazyQuery,
  useMessageRoomPageQuery,
  User,
} from "../../graphql/generated";
import { useTextInput } from "../../hooks/useTextInput";
import { AppFooter } from "../../layouts/AppFooter";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { routes } from "../../routes";
import { assertDefined } from "../../utils/assert-defined";

gql`
  fragment MessageItem on Message {
    id
    user {
      id
      topPhotoUrl
    }
    mine
    content
    createdAt
  }
`;

type MessageItemProps = { message: MessageItemFragment };

const MyMessageItem: FC<MessageItemProps> = ({ message }) => {
  return (
    <HStack alignSelf="end">
      <Box alignSelf="end" fontSize="sm">
        {format(new Date(message.createdAt), "HH:mm")}
      </Box>
      <Box px="3" py="2" rounded="md" bg="green.200" fontWeight="bold" whiteSpace="pre-wrap">
        {message.content}
      </Box>
    </HStack>
  );
};

type PartnerMessageItemProps = { message: MessageItemFragment };

const PartnerMessageItem: FC<PartnerMessageItemProps> = ({ message }) => {
  return (
    <HStack alignSelf="start">
      <Avatar alignSelf="end" size="sm" src={message.user.topPhotoUrl ?? undefined} />
      <Box px="3" py="2" rounded="md" bg="gray.200" fontWeight="bold" whiteSpace="pre-wrap">
        {message.content}
      </Box>
      <Box alignSelf="end" fontSize="sm">
        {format(new Date(message.createdAt), "HH:mm")}
      </Box>
    </HStack>
  );
};

gql`
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      ...MessageItem
    }
  }
`;

const useCreateMessage = (messageRoomId: string) => {
  const [mutate] = useCreateMessageMutation();

  const createMessage = async (content: string) => {
    await mutate({ variables: { input: { messageRoomId, content } } });
  };

  return { createMessage };
};

type MessageRoomPageTemplateProps = {
  partner: Pick<User, "id" | "nickName" | "topPhotoUrl">;
  messages: MessageItemFragment[];
  hasNextPage: boolean;
  onLoadMore: () => Promise<void>;
};

const MessageRoomPageTemplate: FC<MessageRoomPageTemplateProps> = ({ partner, messages, hasNextPage, onLoadMore }) => {
  const header = (
    <AppHeader>
      <HStack spacing="4">
        <BackButton path={routes["/message-rooms"].path()} />
        <Avatar src={partner.topPhotoUrl ?? undefined} />
        <Box fontWeight="bold">{partner.nickName}</Box>
      </HStack>
    </AppHeader>
  );

  const { messageRoomId } = useParams();
  assertDefined(messageRoomId);

  const { createMessage } = useCreateMessage(messageRoomId);

  const [input, reset] = useTextInput();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    await createMessage(input.value);
    reset();
  };

  const footer = (
    <AppFooter>
      <form onSubmit={onSubmit}>
        <HStack>
          <AutoResizeTextarea minRows={2} maxRows={4} isRequired {...input} />
          <IconButton type="submit" h="16" aria-label="send" icon={<BiSend fontSize="28px" />} />
        </HStack>
      </form>
    </AppFooter>
  );

  return (
    <AppLayout header={header} footer={footer}>
      <Stack>
        {messages.map((m) =>
          m.mine ? <MyMessageItem key={m.id} message={m} /> : <PartnerMessageItem key={m.id} message={m} />
        )}
      </Stack>
    </AppLayout>
  );
};

gql`
  query Message($input: MessageInput!) {
    message(input: $input) {
      id
      ...MessageItem
    }
  }
`;

const useSubscribeMessage = (messageRoomId: string) => {
  const client = useApolloClient();

  const [fetch] = useMessageLazyQuery();

  useEffect(() => {
    onSnapshot(
      query(
        collection(getFirestore(), "messageRoomEvents"),
        where("messageRoomId", "==", messageRoomId),
        where("createdAt", ">=", Timestamp.now()),
        orderBy("createdAt", "desc")
      ),
      (snap) => {
        snap.docChanges().forEach(async (dc) => {
          const messageRoomId = dc.doc.data().messageRoomId;
          const messageId = dc.doc.data().messageId;
          const { data } = await fetch({ variables: { input: { messageRoomId, messageId } } });
          if (!data) return;
          client.cache.modify({
            id: client.cache.identify({ __typename: "MessageRoom", id: messageRoomId }),
            fields: {
              messages(existing, { toReference }) {
                const edge = {
                  __typename: "MessageEdge",
                  node: toReference(data.message),
                  cursor: data.message.createdAt,
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
  query MessageRoomPage($id: ID!, $input: PageInput!) {
    messageRoom(id: $id) {
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
`;

const QUERY_SIZE = 10;

export const MessageRoomPage: FC = () => {
  const { messageRoomId } = useParams();
  assertDefined(messageRoomId);

  const { data, refetch } = useMessageRoomPageQuery({ variables: { id: messageRoomId, input: { first: QUERY_SIZE } } });

  useSubscribeMessage(messageRoomId);

  if (!data) return null;

  const partner = data.messageRoom.partner;
  const messages = data.messageRoom.messages.edges.map((e) => e.node).reverse();
  const hasNextPage = data.messageRoom.messages.pageInfo.hasNextPage ?? false;
  const onLoadMore = async () => {
    await refetch({
      id: messageRoomId,
      input: { first: QUERY_SIZE, after: data.messageRoom.messages.pageInfo.endCursor },
    });
  };

  return (
    <MessageRoomPageTemplate partner={partner} messages={messages} hasNextPage={hasNextPage} onLoadMore={onLoadMore} />
  );
};
