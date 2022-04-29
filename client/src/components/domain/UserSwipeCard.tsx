import { gql } from "@apollo/client";
import { Badge, Box, Flex, HStack, Image } from "@chakra-ui/react";
import { FC, useState } from "react";

import { UserForUserSwipeCardFragment } from "../../graphql/generated";

gql`
  fragment UserForUserSwipeCard on User {
    id
    displayName
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
    <Flex
      position="relative"
      h="full"
      sx={{ aspectRatio: "4 / 5" }}
      rounded="md"
      boxShadow="md"
      backgroundImage={`url(${user.photoUrls[activePhotoIndex]})`}
      backgroundSize="100% 100%"
      backgroundRepeat="no-repeat"
    >
      <Box w="50%" onClick={onClickLeftHalf} />
      <Box w="50%" onClick={onClickRightHalf} />

      <HStack position="absolute" top="2" right="2" left="2">
        {user.photoUrls.map((_, i) => (
          <Badge key={i} flex="1" h="1" bg={i === activePhotoIndex ? "white" : "gray.400"} />
        ))}
      </HStack>

      <Box position="absolute" top="70%" left="2" p="4">
        <Box color="white" fontSize="2xl" fontWeight="bold">
          {user.displayName}
        </Box>
        <HStack spacing="4">
          <Box color="white" fontSize="xl" fontWeight="bold">
            25歳
          </Box>
          <Box color="white" fontSize="xl" fontWeight="bold">
            石川
          </Box>
        </HStack>
      </Box>

      <Box position="absolute" display="none">
        {user.photoUrls.map((url) => (
          <Image key={url} src={url} />
        ))}
      </Box>
    </Flex>
  );
};
