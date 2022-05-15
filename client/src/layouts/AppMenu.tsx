import { Box, Flex, HStack } from "@chakra-ui/react";
import { FC } from "react";
import { BiLike, BiMessageRoundedDots, BiSearch, BiUser } from "react-icons/bi";
import { useLocation } from "react-router-dom";

import { AppLink } from "../components/base/AppLink";
import { routes } from "../routes";

export const AppMenu: FC = () => {
  const location = useLocation();

  const rootPath = location.pathname.split("/")[1];

  const isActive = (_rootPath: string) => _rootPath === rootPath;

  return (
    <HStack justifyContent="space-around" alignItems="center">
      <AppLink to={routes["/search-users"].path()} color={isActive("search-users") ? "black" : "gray.500"}>
        <Flex direction="column" alignItems="center">
          <BiSearch fontSize="28px" />
          <Box fontWeight="bold" fontSize="xs">
            さがす
          </Box>
        </Flex>
      </AppLink>

      <AppLink to={routes["/likes"].path()} color={isActive("likes") ? "black" : "gray.500"}>
        <Flex direction="column" alignItems="center" position="relative">
          <BiLike fontSize="28px" />
          <Box fontWeight="bold" fontSize="xs">
            お相手から
          </Box>
        </Flex>
      </AppLink>

      <AppLink to={routes["/message-rooms"].path()} color={isActive("message-rooms") ? "black" : "gray.500"}>
        <Flex direction="column" alignItems="center">
          <BiMessageRoundedDots fontSize="28px" />
          <Box fontWeight="bold" fontSize="xs">
            メッセージ
          </Box>
        </Flex>
      </AppLink>

      <AppLink to={routes["/my-page"].path()} color={isActive("my-page") ? "black" : "gray.500"}>
        <Flex direction="column" alignItems="center">
          <BiUser fontSize="28px" />
          <Box fontWeight="bold" fontSize="xs">
            マイページ
          </Box>
        </Flex>
      </AppLink>
    </HStack>
  );
};
