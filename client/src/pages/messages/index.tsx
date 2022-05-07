import { gql } from "@apollo/client";
import { Avatar, Box, Button, Flex, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { format } from "date-fns";
import { head } from "lodash-es";
import { FC } from "react";
import { BiHeart, BiMessageRoundedDots } from "react-icons/bi";

import {
  MessageRoomItemFragment,
  NewMessageRoomItemFragment,
  useMessageRoomsQuery,
  useNewMessageRoomsQuery,
} from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";

gql`
  fragment NewMessageRoomItem on MessageRoom {
    id
    partner {
      id
      nickName
      photoUrls
    }
  }
`;

gql`
  fragment MessageRoomItem on MessageRoom {
    id
    partner {
      id
      nickName
      photoUrls
    }
    lastMessage {
      id
      content
      createdAt
    }
  }
`;

gql`
  query NewMessageRooms($input: PageInput!) {
    newMessageRooms(input: $input) {
      edges {
        node {
          id
          ...NewMessageRoomItem
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

gql`
  query MessageRooms($input: PageInput!) {
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
`;

type NewMessageRoomItemProps = {
  messageRoom: NewMessageRoomItemFragment;
};

const NewMessageRoomItem: FC<NewMessageRoomItemProps> = ({ messageRoom }) => {
  return (
    <HStack spacing="4">
      <Avatar src={head(messageRoom.partner.photoUrls)} size="lg" />
      <Box>
        <Box fontWeight="bold">{messageRoom.partner.nickName}</Box>
        <Box color="gray.500">メッセージを送信してみましょう！</Box>
      </Box>
    </HStack>
  );
};

type MessageRoomItemProps = {
  messageRoom: MessageRoomItemFragment;
};

const MessageRoomItem: FC<MessageRoomItemProps> = ({ messageRoom }) => {
  return (
    <HStack spacing="4">
      <Avatar src={head(messageRoom.partner.photoUrls)} size="lg" />
      <Box>
        <Flex justifyContent="space-between">
          <Box fontWeight="bold">{messageRoom.partner.nickName}</Box>
          <Box color="gray.500">{format(new Date(messageRoom.lastMessage.createdAt), "yyyy/MM/dd")}</Box>
        </Flex>
        <Box color="gray.500" noOfLines={1}>
          {messageRoom.lastMessage?.content}
        </Box>
      </Box>
    </HStack>
  );
};

const QUERY_SIZE = 6;

const NewMessageRooms: FC = () => {
  const { data, fetchMore } = useNewMessageRoomsQuery({ variables: { input: { first: QUERY_SIZE } } });
  const messageRooms = data?.newMessageRooms.edges.map((e) => e.node) ?? [];
  const hasMore = data?.newMessageRooms.pageInfo.hasNextPage ?? false;
  const onLoadMore = async () => {
    await fetchMore({ variables: { input: { first: QUERY_SIZE, after: data?.newMessageRooms.pageInfo.endCursor } } });
  };

  return (
    <Stack spacing="6">
      {messageRooms.map((mr) => (
        <NewMessageRoomItem key={mr.id} messageRoom={mr} />
      ))}

      {hasMore && (
        <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onLoadMore}>
          もっと見る
        </Button>
      )}
    </Stack>
  );
};

const MessageRooms: FC = () => {
  const { data } = useMessageRoomsQuery({ variables: { input: { first: QUERY_SIZE } } });
  const messageRooms = data?.messageRooms.edges.map((e) => e.node) ?? [];
  return (
    <Stack spacing="8">
      {messageRooms.map((mr) => (
        <MessageRoomItem key={mr.id} messageRoom={mr} />
      ))}
    </Stack>
  );
};

export const MessagesPage: FC = () => {
  return (
    <AppLayout footer={true}>
      <Stack spacing="8">
        <Box fontWeight="bold" fontSize="2xl">
          メッセージ
        </Box>

        <Tabs colorScheme="primary">
          <TabList>
            <Tab w="50%">
              <HStack>
                <BiHeart fontSize="20px" />
                <Box fontWeight="bold">マッチング中</Box>
              </HStack>
            </Tab>
            <Tab w="50%" fontWeight="bold">
              <HStack>
                <BiMessageRoundedDots fontSize="20px" />
                <Box fontWeight="bold">やりとり中</Box>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <NewMessageRooms />
            </TabPanel>
            <TabPanel>
              <MessageRooms />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </AppLayout>
  );
};
