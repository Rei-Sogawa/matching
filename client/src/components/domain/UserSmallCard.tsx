import { gql } from "@apollo/client";
import { Avatar, Box, HStack, VStack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC } from "react";

import { UserSmallCardFragment } from "../../graphql/generated";
import { routes } from "../../routes";
import { AppLink } from "../base/AppLink";

gql`
  fragment UserSmallCard on User {
    id
    gender
    age
    livingPref
    photoUrls
  }
`;

export type UserSmallCard = {
  user: UserSmallCardFragment;
};

export const UserSmallCard: FC<UserSmallCard> = ({ user }) => {
  return (
    <AppLink to={routes["/users/:userId"].path({ userId: user.id })}>
      <VStack>
        <Avatar src={head(user.photoUrls)} w="36" h="36" />
        <HStack>
          <Box fontWeight="bold">{user.age}歳</Box>
          <Box fontWeight="bold">{user.livingPref}</Box>
        </HStack>
      </VStack>
    </AppLink>
  );
};
