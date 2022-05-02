import { gql } from "@apollo/client";
import { Box, Image, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { BackButton } from "../../../components/common/BackButton";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";

gql`
  fragment UserForUserPage on User {
    id
    gender
    nickName
    age
    livingPref
    photoUrls
  }
`;

type UserPageTemplateProps = {};

const UserPageTemplate: FC<UserPageTemplateProps> = ({}) => {
  return (
    <AppLayout footer={false}>
      <Stack>
        <BackButton alignSelf="start" path={routes["/users"].path()} />

        <Box>
          <Image />
        </Box>
      </Stack>
    </AppLayout>
  );
};

export const UserPage: FC = () => {
  return <UserPageTemplate />;
};
