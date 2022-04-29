import { gql } from "@apollo/client";
import { Badge, Box, Flex, HStack, Image } from "@chakra-ui/react";
import { FC, useState } from "react";

import { UserForUserSwipeCardFragment } from "../../graphql/generated";

gql`
  fragment UserForUserSwipeCard on User {
    id
    nickName
    age
    livingPref
    photoUrls
  }
`;

type UserSwipeCardProps = {
  user: UserForUserSwipeCardFragment;
};

export const UserSwipeCard: FC<UserSwipeCardProps> = ({ user }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const onClickLeftHalf = () => {
    setActivePhotoIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };
  const onClickRightHalf = () => {
    setActivePhotoIndex((prev) => (prev === user.photoUrls.length - 1 ? prev : prev + 1));
  };

  return (
    <Flex position="relative" h="full" p="2">
      <Image
        src={user.photoUrls[activePhotoIndex]}
        htmlWidth="400px"
        htmlHeight="500px"
        w="auto"
        h="full"
        rounded="md"
        bg="gray.50"
        boxShadow="md"
      />

      <Box position="absolute" left="0" w="50%" h="full" onClick={onClickLeftHalf} />
      <Box position="absolute" left="50%" w="50%" h="full" onClick={onClickRightHalf} />

      <HStack position="absolute" top="4" right="4" left="4">
        {user.photoUrls.map((_, i) => (
          <Badge key={i} flex="1" h="1" bg={i === activePhotoIndex ? "white" : "gray.400"} />
        ))}
      </HStack>

      <Box position="absolute" top="70%" left="4" p="4">
        <Box color="white" fontSize="2xl" fontWeight="bold">
          {user.nickName}
        </Box>
        <HStack spacing="4">
          <Box color="white" fontSize="xl" fontWeight="bold">
            {user.age}歳
          </Box>
          <Box color="white" fontSize="xl" fontWeight="bold">
            {user.livingPref}
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};
