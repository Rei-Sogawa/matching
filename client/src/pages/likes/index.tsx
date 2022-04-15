import "swiper/css";
import "swiper/css/effect-cards";

import { first } from "lodash-es";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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

type UseUserSwipeOptions = { users: User[]; onLike: () => void; onNope: () => void; onEnd: () => void };

const useUserSwipe = ({ users, onLike, onNope, onEnd }: UseUserSwipeOptions) => {
  const [initialized, setInitialized] = useState(false);

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

  const onSlideChange = (swiper: SwiperClass) => {
    if (!initialized) return;
    if (!activeUser) return;

    const nextActiveIndex = swiper.activeIndex;

    if (activeIndex > nextActiveIndex) {
      setLiked(true);
      setTimeout(() => setLiked(false), 500);

      onLike();
    }
    if (activeIndex < nextActiveIndex) {
      setNoped(true);
      setTimeout(() => setNoped(false), 500);

      onNope();
    }

    if (dirtyUsers.length === 1) onEnd();

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

const AppSwiper = styled.div`
  width: 100%;
  height: 100%;
  .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

export const Likes: FC = () => {
  const navigate = useNavigate();

  const { indexes, activeUser, toLike, toNope, liked, noped, onSwiper, onSlideChange, onShowSlide, onHideSlide } =
    useUserSwipe({
      users,
      onLike: () => {
        console.log("onLike");
        return;
      },
      onNope: () => {
        console.log("onNope");
        return;
      },
      onEnd: () => {
        setTimeout(() => {
          navigate(routes["/"].path());
        }, 500);
        return;
      },
    });

  return (
    <div className="h-full bg-white relative">
      <AppSwiper>
        <Swiper speed={0} effect="cards" modules={[EffectCards]} onSwiper={onSwiper} onSlideChange={onSlideChange}>
          {indexes.map((index) => (
            <SwiperSlide key={index} className="bg-gray-50">
              {activeUser ? (
                <UserSwipeSlide onShow={() => onShowSlide(index)} onHide={() => onHideSlide(index)} user={activeUser} />
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
      <div className="hidden">
        {users
          .flatMap((user) => user.images)
          .map((image) => (
            <img key={image} src={image} />
          ))}
      </div>
    </div>
  );
};
