import "swiper/css";
import "swiper/css/effect-cards";
import "./index.css";

import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import { first } from "lodash-es";
import { FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

import { LikeBadge, NopeBadge } from "../../components/case/LikeNopeBadge";

const getRandomInt = (max: number, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getImage = () => `https://picsum.photos/seed/${getRandomInt(100_000)}/400/600`;

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
    swiper.slidePrev(0);
  };
  const onNope = () => {
    swiper.slideNext(0);
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
  const noOperate = () => {
    return;
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setLoading(true);
    setActiveImage(user.topImage);
    setTimeout(() => setLoading(false), 500);
  }, [user, isActive]);

  const isReady = useMemo(() => isActive && !loading, [isActive, loading]);

  return (
    <div className="h-full py-10 flex flex-col space-y-4">
      <div className={classNames("h-3/4 w-full relative", { hidden: !isReady })}>
        <div className="absolute inset-0">
          <img src={activeImage} className="h-full mx-auto rounded-lg object-contain" />
        </div>
      </div>

      <div className={classNames("h-3/4 flex justify-center items-center", { hidden: isReady })}>
        <div className="text-gray-500 font-bold text-lg">LOADING...</div>
      </div>

      <div className="h-1/4 flex flex-col items-center space-y-4">
        <RadioGroup value={activeImage} onChange={setActiveImage} className="flex space-x-2">
          {user.images.map((image) => (
            <RadioGroup.Option key={image} value={image}>
              {({ checked }) => (
                <input
                  type="radio"
                  checked={checked}
                  onChange={noOperate}
                  className="radio radio-accent"
                  disabled={!isReady}
                />
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>

        <div className="font-bold">{user.displayName}</div>

        <div className="flex-1 flex justify-center items-center space-x-4">
          <button className="btn btn-lg text-white" disabled={!isReady} onClick={onNope}>
            nope
          </button>
          <button className="btn btn-lg btn-success" disabled={!isReady} onClick={onLike}>
            like
          </button>
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
      setTimeout(() => setLiked(false), 500);
    }
    if (activeIndex < nextActiveIndex) {
      setNoped(true);
      setTimeout(() => setNoped(false), 500);
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
