import { Box, Container, Flex, HStack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC } from "react";
import { BiLike, BiMessageRoundedDots, BiSearch, BiUser } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

import { useMe } from "../contexts/Me";
import { routes } from "../routes";

export const AppMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const rootPath = location.pathname.split("/")[1];

  return (
    <>
      <Box flexShrink="0" w="full" h="16" />

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
            <Flex
              color={rootPath === "" ? "black" : "gray.500"}
              direction="column"
              alignItems="center"
              cursor="pointer"
            >
              <BiSearch fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                さがす
              </Box>
            </Flex>
            <Flex
              color={rootPath === "" ? "black" : "gray.500"}
              direction="column"
              alignItems="center"
              cursor="pointer"
            >
              <BiLike fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                いいね
              </Box>
            </Flex>
            <Flex
              color={rootPath === "" ? "black" : "gray.500"}
              direction="column"
              alignItems="center"
              cursor="pointer"
            >
              <BiMessageRoundedDots fontSize="28px" />
              <Box fontWeight="bold" fontSize="xs">
                メッセージ
              </Box>
            </Flex>
            <Flex
              color={rootPath === "my-page" ? "black" : "gray.500"}
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
