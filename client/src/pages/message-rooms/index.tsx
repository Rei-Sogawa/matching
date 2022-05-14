import { gql } from "@apollo/client";
import { Avatar, Box, Button, Flex, HStack, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { format } from "date-fns";
import { head } from "lodash-es";
import { FC } from "react";
import { BiHeart, BiMessageRoundedDots } from "react-icons/bi";

import { AppLink } from "../../components/base/AppLink";
import { NewMessageRoomItemFragment, OpenedMessageRoomItemFragment } from "../../graphql/generated";
import { useNewMessageRooms, useOpenedMessageRooms } from "../../hooks/domain/useMessageRoom";
import { AppFooter } from "../../layouts/AppFooter";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { AppMenu } from "../../layouts/AppMenu";
import { routes } from "../../routes";

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
  fragment OpenedMessageRoomItem on MessageRoom {
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

type NewMessageRoomItemProps = {
  messageRoom: NewMessageRoomItemFragment;
};

const NewMessageRoomItem: FC<NewMessageRoomItemProps> = ({ messageRoom }) => {
  return (
    <AppLink
      to={routes["/message-rooms/:messageRoomId"].path({ messageRoomId: messageRoom.id })}
      _hover={{ textDecoration: "none" }}
    >
      <HStack spacing="4">
        <Avatar src={head(messageRoom.partner.photoUrls)} size="lg" />
        <Box>
          <Box fontWeight="bold">{messageRoom.partner.nickName}</Box>
          <Box fontSize="sm" color="gray.500">
            メッセージを送信してみましょう！
          </Box>
        </Box>
      </HStack>
    </AppLink>
  );
};

type OpenedMessageRoomItemProps = {
  messageRoom: OpenedMessageRoomItemFragment;
};

const OpenedMessageRoomItem: FC<OpenedMessageRoomItemProps> = ({ messageRoom }) => {
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

const NewMessageRooms: FC = () => {
  const { data, onLoadMore } = useNewMessageRooms();

  const messageRooms = data?.viewer.newMessageRooms.edges.map((e) => e.node) ?? [];
  const hasMore = data?.viewer.newMessageRooms.pageInfo.hasNextPage ?? false;

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

const OpenedMessageRooms: FC = () => {
  const { data, onLoadMore } = useOpenedMessageRooms();

  const messageRooms = data?.viewer.openedMessageRooms.edges.map((e) => e.node) ?? [];
  const hasMore = data?.viewer.openedMessageRooms.pageInfo.hasNextPage ?? false;

  return (
    <Stack spacing="6">
      {messageRooms.map((mr) => (
        <OpenedMessageRoomItem key={mr.id} messageRoom={mr} />
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
  const footer = (
    <AppFooter>
      <AppMenu />
    </AppFooter>
  );

  return (
    <AppLayout header={null} footer={footer}>
      <AppMain>
        <Stack spacing="8">
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
                <OpenedMessageRooms />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </AppMain>
    </AppLayout>
  );
};
