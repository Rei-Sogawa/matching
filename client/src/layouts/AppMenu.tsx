import { Box, Container, Flex, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { BiLike, BiMessageRoundedDots, BiSearch, BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

import { useMe } from "../contexts/Me";
import { routes } from "../routes";

export const AppMenu: FC = () => {
  const navigate = useNavigate();

  const me = useMe();

  return (
    <Box h="16">
      <Box w="full" h="16" position="fixed" bottom="0" zIndex={100} borderTopWidth="1px" borderColor="gray.200">
        <Container h="full" bg="white">
          <HStack h="full" justifyContent="space-between" alignItems="center">
            <Flex
              direction="column"
              alignItems="center"
              cursor="pointer"
              onClick={() => navigate(routes["/users/:userId/edit"].path({ userId: me.id }))}
            >
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
            <Flex direction="column" alignItems="center" cursor="pointer">
              <BiUser fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                その他
              </Box>
            </Flex>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
};
