import { gql } from "@apollo/client";
import { Avatar, Box, HStack, IconButton } from "@chakra-ui/react";
import { FC, FormEventHandler } from "react";
import { BiSend } from "react-icons/bi";
import { useParams } from "react-router-dom";

import { AutoResizeTextarea } from "../../components/base/AutoResizeTextarea";
import { BackButton } from "../../components/common/BackButton";
import { MessageItemFragment, useMessageRoomPageQuery, User } from "../../graphql/generated";
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
        <BackButton path={routes["/message-rooms"].path()} />
        <Avatar src={partner.topPhotoUrl ?? undefined} />
        <Box fontWeight="bold">{partner.nickName}</Box>
      </HStack>
    </AppHeader>
  );

  const [input, reset] = useTextInput();

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    console.log(input.value);
    reset();
  };

  const footer = (
    <AppFooter>
      <form onSubmit={onSubmit}>
        <HStack>
          <AutoResizeTextarea minRows={2} maxRows={4} isRequired {...input} />
          <IconButton type="submit" h="16" variant="ghost" aria-label="send" icon={<BiSend fontSize="28px" />} />
        </HStack>
      </form>
    </AppFooter>
  );

  return <AppLayout header={header} footer={footer}></AppLayout>;
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
