import { gql } from "@apollo/client";
import { Avatar, Box, Button, HStack, IconButton, Stack } from "@chakra-ui/react";
import { format } from "date-fns";
import { head } from "lodash-es";
import { FC, FormEventHandler, useEffect, useMemo, useRef } from "react";
import { BiSend } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

import { AutoResizeTextarea } from "../../components/base/AutoResizeTextarea";
import { BackButton } from "../../components/case/BackButton";
import { MessageItemFragment, User } from "../../graphql/generated";
import { useTextInput } from "../../hooks/common/useTextInput";
import { useCreateMessage, useMessageRoom, useSubscribeMessage } from "../../hooks/domain/message-room";
import { AppFooter } from "../../layouts/AppFooter";
import { AppHeader } from "../../layouts/AppHeader";
import { AppLayout } from "../../layouts/AppLayout";
import { AppMain } from "../../layouts/AppMain";
import { routes } from "../../routes";
import { assertDefined } from "../../utils/assert-defined";

const sleep = (ms: number) =>
  new Promise((res) => {
    setTimeout(res, ms);
  });

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
      <Box px="3" py="2" rounded="md" bg="gray.100" fontWeight="bold" whiteSpace="pre-wrap">
        {message.content}
      </Box>
      <Box alignSelf="end" fontSize="sm">
        {format(new Date(message.createdAt), "HH:mm")}
      </Box>
    </HStack>
  );
};

type MessageRoomPageTemplateProps = {
  partner: Pick<User, "id" | "nickName" | "topPhotoUrl">;
  messages: MessageItemFragment[];
  hasNextPage: boolean;
  onLoadMore: () => Promise<void>;
};

const MessageRoomPageTemplate: FC<MessageRoomPageTemplateProps> = ({ partner, messages, hasNextPage, onLoadMore }) => {
  const navigate = useNavigate();

  const header = (
    <AppHeader>
      <HStack spacing="4">
        <BackButton onClick={() => navigate(routes["/message-rooms"].path())} />
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
        <HStack py="2">
          <AutoResizeTextarea minRows={2} maxRows={4} isRequired {...input} />
          <IconButton type="submit" h="16" aria-label="send" icon={<BiSend fontSize="28px" />} />
        </HStack>
      </form>
    </AppFooter>
  );

  const lastMessageId = useMemo(() => head(messages)?.id ?? "", [messages]);

  const mainRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    assertDefined(mainRef.current);
    mainRef.current.scrollTo({ top: mainRef.current.scrollHeight });
  }, [lastMessageId]);

  const onClick = async () => {
    assertDefined(mainRef.current);
    const prevScrollHeight = mainRef.current.scrollHeight;

    await onLoadMore();

    await sleep(0);
    mainRef.current.scroll({ top: mainRef.current.scrollHeight - prevScrollHeight });
  };

  return (
    <AppLayout header={header} footer={footer}>
      <AppMain ref={mainRef}>
        <Stack direction="column-reverse">
          {messages.map((m) =>
            m.mine ? <MyMessageItem key={m.id} message={m} /> : <PartnerMessageItem key={m.id} message={m} />
          )}

          {hasNextPage && (
            <Button alignSelf="center" variant="ghost" colorScheme="primary" onClick={onClick}>
              もっと見る
            </Button>
          )}
        </Stack>
      </AppMain>
    </AppLayout>
  );
};

export const MessageRoomPage: FC = () => {
  const { messageRoomId } = useParams();
  assertDefined(messageRoomId);

  const { data, onLoadMore } = useMessageRoom(messageRoomId);
  useSubscribeMessage(messageRoomId);

  if (!data) return null;

  const partner = data.viewer.messageRoom.partner;
  const messages = data.viewer.messageRoom.messages.edges.map((e) => e.node);
  const hasNextPage = data.viewer.messageRoom.messages.pageInfo.hasNextPage ?? false;

  return (
    <MessageRoomPageTemplate partner={partner} messages={messages} hasNextPage={hasNextPage} onLoadMore={onLoadMore} />
  );
};
