import "swiper/css";
import "swiper/css/effect-cards";

import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { first } from "lodash-es";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EffectCards, Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import { SwipeLikeBadge } from "../../components/case/SwipeLikeBadge";
import { SwipeNopeBadge } from "../../components/case/SwipeNopeBadge";
import { UserSwipePadSlide } from "../../components/domain/UserSwipePadSlide";
import { UserSwipeSlide } from "../../components/domain/UserSwipeSlide";
import { routes } from "../../routes";

const getRandomInt = (max: number, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getImage = () => `https://picsum.photos/seed/${getRandomInt(100_000)}/400/600`;

export type User = {
  id: string;
  displayName: string;
  topImage: string;
  images: string[];
};

const users: User[] = Array.from({ length: 3 }).map((_, index) => {
  const topImage = getImage();
  const restImages = Array.from({ length: getRandomInt(5) }).map(() => getImage());
  return {
    id: index.toString(),
    displayName: `user-${index}`,
    topImage,
    images: [topImage, ...restImages],
  };
});

type UseUserSwipeOptions = {
  users: User[];
  onLike: (user: User) => void;
  onNope: (user: User) => void;
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
        setLoading(false);
      }, 500);
    }
    if (activeIndex < nextActiveIndex) {
      setLoading(true);
      setNoped(true);

      await onNope(activeUser);

      setTimeout(() => {
        setNoped(false);
        setLoading(false);
      }, 500);
    }

    if (dirtyUsers.length === 1) {
      setTimeout(() => {
        onEnd();
      }, 500);
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

export const LikesPage: FC = () => {
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
              {activeUser ? (
                <UserSwipeSlide
                  loading={loading}
                  user={activeUser}
                  onShow={() => onShowSlide(index)}
                  onHide={() => onHideSlide(index)}
                />
              ) : (
                <UserSwipePadSlide onShow={() => onShowSlide(index)} onHide={() => onHideSlide(index)} />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </AppSwiper>

      {(toLike || liked) && <SwipeLikeBadge />}
      {(toNope || noped) && <SwipeNopeBadge />}

      {/* NOTE: for cache */}
      <Box hidden>
        {users
          .flatMap((user) => user.images)
          .map((image) => (
            <img key={image} src={image} />
          ))}
      </Box>
    </Box>
  );
};
