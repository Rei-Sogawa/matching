import { gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { FC } from "react";
import { useParams } from "react-router-dom";

import { AppLayout } from "../../layouts/AppLayout";

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

export const MessageRoomPage: FC = () => {
  const { messageRoomId } = useParams();
  return <AppLayout header={null} footer={null}></AppLayout>;
};
