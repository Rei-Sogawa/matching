import "swiper/css";
import "swiper/css/effect-cards";
import "./index.css";

import classNames from "classnames";
import { first } from "lodash-es";
import { ChangeEventHandler, FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

import { LikeBadge, NopeBadge } from "../../components/case/LikeNopeBadge";

const getRandomInt = (max: number, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getImage = () => `https://picsum.photos/seed/${getRandomInt(1000)}/800/1200`;

type User = {
  id: string;
  displayName: string;
  topImage: string;
  images: string[];
};

const users: User[] = Array.from({ length: 10 }).map((_, index) => {
  const topImage = getImage();
  const restImages = Array.from({ length: getRandomInt(5) }).map(() => getImage());
  return {
    id: index.toString(),
    displayName: `user-${index}`,
    topImage,
    images: [topImage, ...restImages],
  };
});

type UserSlideProps = {
  index: number;
  onShow: (index: number) => void;
  onHide: (index: number) => void;
  user: User;
};

const UserSlide: FC<UserSlideProps> = ({ index, onShow, onHide, user }) => {
  const swiper = useSwiper();
  const onLike = () => {
    swiper.slidePrev(500);
  };
  const onNope = () => {
    swiper.slideNext(500);
  };

  const { isActive, isVisible } = useSwiperSlide();
  useEffect(() => {
    if (isVisible) {
      onShow(index);
    } else {
      onHide(index);
    }
  }, [isVisible]);

  const [activeImage, setActiveImage] = useState(user.topImage);
  const onSelectImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setActiveImage(e.target.value);
    }, 100);
  };
  useEffect(() => {
    if (!isActive) return;
    setActiveImage(user.topImage);
  }, [user, isActive]);

  return (
    <div className="h-full flex flex-col space-y-2">
      <div className="h-3/4">
        <div className="h-full relative">
          <div className="absolute inset-0">
            <img
              key={index}
              src={activeImage}
              className={classNames("h-full w-full py-2 object-contain", { hidden: !isActive })}
            />
          </div>
        </div>
      </div>

      <div className="h-1/4 flex flex-col items-center space-y-2">
        <div className="flex space-x-2">
          {user.images.map((image, index) => (
            <input
              key={index}
              type="radio"
              className="radio radio-accent"
              value={image}
              checked={image == activeImage}
              onChange={onSelectImage}
            />
          ))}
        </div>

        <div className="font-bold">{user.displayName}</div>

        <div className="flex-1 flex items-center">
          <div className="flex item-center space-x-4">
            <button className="btn btn-lg text-white" onClick={onNope}>
              nope
            </button>
            <button className="btn btn-lg btn-success" onClick={onLike}>
              like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type PadSlideProps = {
  index: number;
  onShow: (index: number) => void;
  onHide: (index: number) => void;
};

const PadSlide: FC<PadSlideProps> = ({ index, onShow, onHide }) => {
  const { isVisible } = useSwiperSlide();
  useEffect(() => {
    if (isVisible) {
      onShow(index);
    } else {
      onHide(index);
    }
  }, [isVisible]);
  return null;
};

export const Likes: FC = () => {
  const [init, setInit] = useState(false);

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

  const onShowSlide = (index: number) => {
    setVisibleIndexes((prev) => [...new Set(prev.concat(index))]);
  };
  const onHideSlide = (index: number) => {
    setVisibleIndexes((prev) => prev.filter((_index) => _index !== index));
  };

  const onSwiper = (swiper: SwiperClass) => {
    swiper.slideTo(users.length);
    setTimeout(() => {
      setInit(true);
    }, 1_000);
  };
  const onSlideChange = (swiper: SwiperClass) => {
    if (!init) return;
    if (!activeUser) return;

    const nextActiveIndex = swiper.activeIndex;

    if (activeIndex > nextActiveIndex) {
      setLiked(true);
      setTimeout(() => setLiked(false), 250);
    }
    if (activeIndex < nextActiveIndex) {
      setNoped(true);
      setTimeout(() => setNoped(false), 250);
    }

    setActiveIndex(nextActiveIndex);
    setDirtyUsers((prev) => prev.slice(1));
  };

  return (
    <div className="h-full bg-white relative">
      <Swiper
        speed={0}
        effect="cards"
        modules={[EffectCards]}
        className="app-swiper"
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
      >
        {indexes.map((index) => (
          <SwiperSlide key={index} className="bg-gray-50">
            {activeUser ? (
              <UserSlide index={index} onShow={onShowSlide} onHide={onHideSlide} user={activeUser} />
            ) : (
              <PadSlide index={index} onShow={onShowSlide} onHide={onHideSlide} />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {(toLike || liked) && <LikeBadge />}
      {(toNope || noped) && <NopeBadge />}
    </div>
  );
};
