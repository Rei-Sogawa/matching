import "swiper/css";
import "swiper/css/effect-cards";

import { gql } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { first } from "lodash-es";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EffectCards, Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { SwipeLikeBadge } from "../../components/case/SwipeLikeBadge";
import { SwipeNopeBadge } from "../../components/case/SwipeNopeBadge";
import { UserSwipeSlide } from "../../components/domain/UserSwipeSlide";
import { UserForUserSwipeSlideFragment, useUsersQuery } from "../../graphql/generated";
import { routes } from "../../routes";

gql`
  query Users {
    users {
      id
      ...UserForUserSwipeSlide
    }
  }
`;

const useUsers = () => {
  const { data, loading } = useUsersQuery();
  const users = data?.users ?? [];
  return { loading, users };
};

type UseUserSwipeOptions = {
  users: UserForUserSwipeSlideFragment[];
  onLike: (user: UserForUserSwipeSlideFragment) => void;
  onNope: (user: UserForUserSwipeSlideFragment) => void;
  onEnd: () => void;
};

const useUserSwipe = ({ users, onLike, onNope, onEnd }: UseUserSwipeOptions) => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dirtyUsers, setDirtyUsers] = useState(users);
  const activeUser = useMemo(() => first(dirtyUsers), [dirtyUsers]);

  const indexes = useMemo(() => Array.from({ length: users.length * 2 + 1 }).map((_, index) => index), []);
  const [activeIndex, setActiveIndex] = useState(users.length);
  const [visibleIndexes, setVisibleIndexes] = useState([users.length]);
  const [liked, setLiked] = useState(false);
  const [noped, setNoped] = useState(false);

  const toLike = useMemo(() => {
    if (!activeUser) return false;
    if (visibleIndexes.length !== 2) return false;
    return visibleIndexes.some((index) => index < activeIndex);
  }, [visibleIndexes]);

  const toNope = useMemo(() => {
    if (!activeUser) return false;
    if (visibleIndexes.length !== 2) return false;
    return visibleIndexes.some((index) => index > activeIndex);
  }, [visibleIndexes]);

  const onSwiper = (swiper: SwiperClass) => {
    swiper.slideTo(users.length);
    setInitialized(true);
  };

  const onSlideChange = async (swiper: SwiperClass) => {
    if (!initialized) return;
    if (loading) return;
    if (!activeUser) return;

    const nextActiveIndex = swiper.activeIndex;

    if (activeIndex > nextActiveIndex) {
      setLoading(true);
      setLiked(true);

      await onLike(activeUser);

      setTimeout(() => {
        setLiked(false);
      }, 500);
      setTimeout(() => {
        setLoading(false);
      }, 750);
    }
    if (activeIndex < nextActiveIndex) {
      setLoading(true);
      setNoped(true);

      await onNope(activeUser);

      setTimeout(() => {
        setNoped(false);
      }, 500);
      setTimeout(() => {
        setLoading(false);
      }, 750);
    }

    if (dirtyUsers.length === 1) {
      setTimeout(() => {
        onEnd();
      }, 750);
    }

    setActiveIndex(nextActiveIndex);
    setDirtyUsers((prev) => prev.slice(1));
  };

  const onShowSlide = (index: number) => {
    setVisibleIndexes((prev) => [...new Set(prev.concat(index))]);
  };

  const onHideSlide = (index: number) => {
    setVisibleIndexes((prev) => prev.filter((_index) => _index !== index));
  };

  return {
    loading,
    activeUser,
    indexes,
    liked,
    noped,
    toLike,
    toNope,
    onSwiper,
    onSlideChange,
    onShowSlide,
    onHideSlide,
  };
};

const AppSwiper = styled(Box)`
  width: 100%;
  height: 100%;
  .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .swiper-slide {
    background-color: #fff;
  }
`;

type LikesPageViewProps = { users: UserForUserSwipeSlideFragment[] };

const LikesPageView: FC<LikesPageViewProps> = ({ users }) => {
  const navigate = useNavigate();

  const {
    loading,
    indexes,
    activeUser,
    toLike,
    toNope,
    liked,
    noped,
    onSwiper,
    onSlideChange,
    onShowSlide,
    onHideSlide,
  } = useUserSwipe({
    users,
    onLike: (user) => {
      console.log("onLike");
      console.log(user);
    },
    onNope: (user) => {
      console.log("onNope");
      console.log(user);
    },
    onEnd: () => {
      navigate(routes["/"].path());
    },
  });

  return (
    <Box position="relative" h="full" bg="white">
      <AppSwiper>
        <Swiper speed={0} effect="cards" modules={[EffectCards]} onSwiper={onSwiper} onSlideChange={onSlideChange}>
          {indexes.map((index) => (
            <SwiperSlide key={index}>
              <UserSwipeSlide
                loading={loading}
                user={activeUser}
                onShow={() => onShowSlide(index)}
                onHide={() => onHideSlide(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </AppSwiper>

      {(toLike || liked) && <SwipeLikeBadge />}
      {(toNope || noped) && <SwipeNopeBadge />}
    </Box>
  );
};

export const LikesPage: FC = () => {
  const { loading, users } = useUsers();

  return loading ? null : <LikesPageView users={users} />;
};
