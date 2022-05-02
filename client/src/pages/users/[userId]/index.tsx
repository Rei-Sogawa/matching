import { gql } from "@apollo/client";
import { Box, BoxProps, HStack, IconButton, Image, Stack, VStack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC } from "react";
import { BiLike, BiShare } from "react-icons/bi";
import { useParams } from "react-router-dom";

import { BackButton } from "../../../components/common/BackButton";
import { UserForUserPageFragment, useUserQuery } from "../../../graphql/generated";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";
import { assertDefined } from "../../../utils/assert-defined";

const Card: FC<BoxProps> = (props) => {
  return <Box maxW="md" p="4" rounded="md" boxShadow="md" bg="white" {...props} />;
};

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

type UserPageTemplateProps = { user: UserForUserPageFragment };

const UserPageTemplate: FC<UserPageTemplateProps> = ({ user }) => {
  return (
    <AppLayout footer={false} bg="gray.50">
      <VStack>
        <BackButton alignSelf="start" path={routes["/users"].path()} />

        <Card>
          <Stack spacing="4">
            <Image src={head(user.photoUrls)} rounded="md" />
            <Box>
              <Box fontWeight="bold" fontSize="2xl">
                {user.nickName}
              </Box>
              <HStack>
                <Box color="gray" fontWeight="bold">
                  {user.age}歳
                </Box>
                <Box color="gray" fontWeight="bold">
                  {user.livingPref}
                </Box>
                <Box color="gray" fontWeight="bold">
                  {user.gender === "MALE" ? "男性" : "女性"}
                </Box>
              </HStack>
            </Box>
          </Stack>
        </Card>
      </VStack>

      <HStack spacing="8" position="absolute" bottom="16" left="50%" transform="translateX(-50%)">
        <IconButton h="16" w="16" isRound boxShadow="md" aria-label="skip" icon={<BiShare fontSize="28px" />} />
        <IconButton
          colorScheme="primary"
          h="16"
          w="16"
          isRound
          boxShadow="md"
          aria-label="like"
          icon={<BiLike fontSize="28px" />}
        />
      </HStack>
    </AppLayout>
  );
};

gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      ...UserForUserPage
    }
  }
`;

export const UserPage: FC = () => {
  const { userId } = useParams();
  assertDefined(userId);
  const { data } = useUserQuery({ variables: { id: userId } });

  return data ? <UserPageTemplate user={data.user} /> : null;
};
