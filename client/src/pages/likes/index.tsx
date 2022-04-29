import { gql } from "@apollo/client";
import { Box, HStack, IconButton, Stack } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";

import { SwipeCardItem } from "../../components/case/SwipeCardItem";
import { SwipeCardList } from "../../components/case/SwipeCardList";
import { SwipeLikeBadge } from "../../components/case/SwipeLikeBadge";
import { SwipeNopeBadge } from "../../components/case/SwipeNopeBadge";
import { UserSwipeCard } from "../../components/domain/UserSwipeCard";
import { UserForUserSwipeCardFragment, useUsersQuery } from "../../graphql/generated";
import { useSwipe } from "../../hooks/useSwipe";

gql`
  query UsersForLikes {
    users {
      id
      ...UserForUserSwipeCard
    }
  }
`;

const useUsers = () => {
  const { data, loading } = useUsersQuery();
  const users = data?.users ?? [];
  return { loading, users };
};

type LikePageTemplateProps = {
  users: UserForUserSwipeCardFragment[];
};

const LikePageTemplate: FC<LikePageTemplateProps> = ({ users }) => {
  const [liked, setLiked] = useState(false);
  const [noped, setNoped] = useState(false);

  const onLike = () => {
    console.log("onLike");
    setLiked(true);
    setTimeout(() => {
      setLiked(false);
    }, 500);
  };

  const onNope = () => {
    console.log("onNope");
    setNoped(true);
    setTimeout(() => {
      setNoped(false);
    }, 500);
  };

  const onEnd = () => {
    console.log("onEnd");
  };

  const {
    currentSwipeItem,
    toRight: toLike,
    toLeft: toNope,
    doRight: doLike,
    doLeft: doNope,
    swipeItems,
    bind,
    style,
  } = useSwipe({
    length: users.length,
    onRight: onLike,
    onLeft: onNope,
    onEnd,
  });

  const onClickLike = () => {
    doLike(currentSwipeItem);
    onLike();
  };

  const onClickNope = () => {
    doNope(currentSwipeItem);
    onNope();
  };

  return (
    <Stack position="relative" h="full">
      <Box h="10%" />
      <Box position="relative" flex="1">
        {swipeItems.map(({ x, y, rot }, i) => (
          <SwipeCardList key={i} style={{ x, y }}>
            <SwipeCardItem {...bind(i)} style={style(rot)}>
              <UserSwipeCard user={users[i]} />
            </SwipeCardItem>
          </SwipeCardList>
        ))}
      </Box>
      <HStack alignSelf="center" h="25%" spacing="8">
        <IconButton
          w="20"
          h="20"
          fontSize="2xl"
          isRound
          icon={<BiDislike />}
          aria-label="dislike"
          onClick={onClickNope}
        />
        <IconButton
          w="20"
          h="20"
          fontSize="2xl"
          isRound
          colorScheme="primary"
          icon={<BiLike />}
          aria-label="like"
          onClick={onClickLike}
        />
      </HStack>

      {(toLike || liked) && <SwipeLikeBadge />}
      {(toNope || noped) && <SwipeNopeBadge />}
    </Stack>
  );
};

export const LikesPage: FC = () => {
  const { loading, users } = useUsers();

  return loading ? null : <LikePageTemplate users={users} />;
};
