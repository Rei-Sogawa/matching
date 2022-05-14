import { gql } from "@apollo/client";
import { Avatar, Box, Button, Flex, HStack, Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import { head } from "lodash-es";
import { FC } from "react";

import { AppLink } from "../../components/base/AppLink";
import { MessageRoomItemFragment } from "../../graphql/generated";
import { useMessageRooms } from "../../hooks/domain/useMessageRoom";
import { AppFooter } from "../../layouts/AppFooter";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { AppMenu } from "../../layouts/AppMenu";
import { routes } from "../../routes";

gql`
  fragment MessageRoomItem on MessageRoom {
    id
    partner {
      id
      nickName
      photoUrls
    }
    latestMessage {
      id
      content
      createdAt
    }
  }
`;

type MessageRoomItemProps = {
  messageRoom: MessageRoomItemFragment;
};

const MessageRoomItem: FC<MessageRoomItemProps> = ({ messageRoom }) => {
  return (
    <AppLink
      to={routes["/message-rooms/:messageRoomId"].path({ messageRoomId: messageRoom.id })}
      _hover={{ textDecoration: "none" }}
    >
      <HStack spacing="4">
        <Avatar src={head(messageRoom.partner.photoUrls)} size="lg" />
        <Box flex="1">
          <Flex justifyContent="space-between">
            <Box fontWeight="bold">{messageRoom.partner.nickName}</Box>
            <Box color="gray.500">{format(new Date(messageRoom.latestMessage.createdAt), "yyyy/MM/dd")}</Box>
          </Flex>
          <Box color="gray.500" noOfLines={1}>
            {messageRoom.latestMessage.content}
          </Box>
        </Box>
      </HStack>
    </AppLink>
  );
};

const MessageRooms: FC = () => {
  const { data, onLoadMore } = useMessageRooms();

  const messageRooms = data?.viewer.messageRooms.edges.map((e) => e.node) ?? [];
  const hasMore = data?.viewer.messageRooms.pageInfo.hasNextPage ?? false;

  return (
    <Stack spacing="6">
      {messageRooms.map((mr) => (
        <MessageRoomItem key={mr.id} messageRoom={mr} />
      ))}

      {hasMore && (
        <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onLoadMore}>
          もっと見る
        </Button>
      )}
    </Stack>
  );
};

export const MessageRoomsPage: FC = () => {
  const header = (
    <AppHeader>
      <Flex justifyContent="center">
        <Box fontWeight="bold" fontSize="2xl">
          メッセージ
        </Box>
      </Flex>
    </AppHeader>
  );

  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  return (
    <AppLayout header={header} footer={footer}>
      <AppMain>
        <MessageRooms />
      </AppMain>
    </AppLayout>
  );
};
