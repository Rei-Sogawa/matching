import { gql } from "@apollo/client";
import { Avatar, Box, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { useParams } from "react-router-dom";

import { MessageItemFragment, useMessageRoomPageQuery, User } from "../../graphql/generated";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
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

const MyMessageItem: FC = () => {
  return <Box></Box>;
};

const PartnerMessageItem: FC = () => {
  return <Box></Box>;
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
        <Avatar src={partner.topPhotoUrl ?? undefined} />
        <Box fontWeight="bold">{partner.nickName}</Box>
      </HStack>
    </AppHeader>
  );
  return <AppLayout header={header} footer={null}></AppLayout>;
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

  if (!data) return null;

  const partner = data.messageRoom.partner;
  const messages = data.messageRoom.messages.edges.map((e) => e.node);
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
