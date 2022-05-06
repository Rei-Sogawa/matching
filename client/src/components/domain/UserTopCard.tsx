import { gql } from "@apollo/client";
import { Box, HStack, Stack } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";

import { UserTopCardFragment } from "../../graphql/generated";

gql`
  fragment UserTopCard on User {
    id
    gender
    nickName
    age
    livingPref
    photoUrls
  }
`;

type UserTopCardProps = { user: UserTopCardFragment; imageForeground?: ReactNode };

export const UserTopCard: FC<UserTopCardProps> = ({ user, imageForeground }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const onClickRight = () => {
    if (activeImageIndex < user.photoUrls.length - 1) {
      setActiveImageIndex((prev) => prev + 1);
    }
  };
  const onClickLeft = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex((prev) => prev - 1);
    }
  };

  return (
    <Box w={{ base: "full", md: "lg" }} p="4" rounded="md" boxShadow="md" bg="white">
      <Stack spacing="4">
        <Box
          rounded="md"
          sx={{ aspectRatio: "1 / 1 " }}
          backgroundImage={`url(${user.photoUrls[activeImageIndex]})`}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          position="relative"
        >
          {imageForeground}

          <HStack position="absolute" bottom="2" w="full" px="2">
            {user.photoUrls.map((_, i) => (
              <Box key={i} flex="1" h="1" bg={i === activeImageIndex ? "white" : "gray.500"} />
            ))}
          </HStack>

          <Box position="absolute" top="0" left="0" w="50%" h="100%" cursor="pointer" onClick={onClickLeft} />
          <Box position="absolute" top="0" left="50%" w="50%" h="100%" cursor="pointer" onClick={onClickRight} />
        </Box>

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
    </Box>
  );
};
