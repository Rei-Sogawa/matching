import { Box, Container, Flex, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { BiLike, BiMessageRoundedDots, BiSearch, BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { useMe } from "../contexts/Me";
import { routes } from "../routes";

export const AppMenu: FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box flexShrink="0" w="full" h="16"></Box>

      <Box
        w="full"
        h="16"
        position="fixed"
        bottom="0"
        zIndex="100"
        borderTopWidth="1px"
        borderColor="gray.200"
        bg="gray.50"
      >
        <Container h="full">
          <HStack h="full" justifyContent="space-between" alignItems="center">
            <Flex direction="column" alignItems="center" cursor="pointer">
              <BiSearch fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                さがす
              </Box>
            </Flex>
            <Flex direction="column" alignItems="center" cursor="pointer">
              <BiLike fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                いいね
              </Box>
            </Flex>
            <Flex direction="column" alignItems="center" cursor="pointer">
              <BiMessageRoundedDots fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                メッセージ
              </Box>
            </Flex>
            <Flex
              direction="column"
              alignItems="center"
              cursor="pointer"
              onClick={() => navigate(routes["/my-page"].path())}
            >
              <BiUser fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                マイページ
              </Box>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </>
  );
};
