import "swiper/css";
import "swiper/css/effect-cards";
import "./index.css";

import { ChangeEventHandler, FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Swiper as SwiperClass } from "swiper";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

import { LikeBadge, NopeBadge } from "../../components/case/LikeNopeBadge";

const getRandomArbitrary = (max: number, min = 0) => {
  return Math.random() * (max - min) + min;
};

const getImage = () => `https://picsum.photos/seed/${getRandomArbitrary(1000)}/800/1200`;

type User = {
  id: string;
  displayName: string;
  topImage: string;
  images: string[];
};

const users: User[] = Array.from({ length: 5 }).map((_, index) => {
  const topImage = getImage();
  const restImages = Array.from({ length: getRandomArbitrary(5) }).map(() => getImage());
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
  const onSelectImage: ChangeEventHandler<HTMLInputElement> = (e) => setActiveImage(e.target.value);

  return (
    <div className="h-full flex flex-col space-y-2">
      <div className="h-3/4">
        <div className="h-full flex flex-col space-y-2">
          {isActive && (
            <>
              <div className="flex-1 relative">
                <div className="absolute inset-0">
                  <img src={activeImage} className="h-full w-full object-cover" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="h-1/4 flex flex-col items-center space-y-2">
        <div className="self-center flex space-x-2">
          {user.images.map((image, index) => (
            <input
              key={index}
              type="radio"
              className="radio radio-accent"
              value={image}
              checked={image === activeImage}
              onChange={onSelectImage}
            />
          ))}
        </div>

        <div className="flex-1 flex items-center space-x-4">
          <button className="btn btn-lg text-white" onClick={onNope}>
            nope
          </button>
          <button className="btn btn-lg btn-success" onClick={onLike}>
            like
          </button>
        </div>
      </div>
    </div>
  );
};

export const Likes: FC = () => {
  const [init, setInit] = useState(false);

  const [dirtyUsers, setDirtyUsers] = useState(users);
  const activeUser = useMemo(() => dirtyUsers.at(0), [dirtyUsers]);

  const indexes = useMemo(() => Array.from({ length: users.length * 2 - 1 }).map((_, index) => index), []);
  const [activeIndex, setActiveIndex] = useState(users.length - 1);
  const [visibleIndexes, setVisibleIndexes] = useState([users.length - 1]);
  const [liked, setLiked] = useState(false);
  const [noped, setNoped] = useState(false);

  const toLike = useMemo(() => {
    if (visibleIndexes.length !== 2) return false;
    return visibleIndexes.some((index) => index < activeIndex);
  }, [visibleIndexes]);
  const toNope = useMemo(() => {
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
    swiper.slideTo(users.length - 1);
    setTimeout(() => {
      setInit(true);
    }, 1_000);
  };
  const onSlideChange = (swiper: SwiperClass) => {
    if (!init) return;

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
        effect="cards"
        modules={[EffectCards]}
        speed={500}
        className="app-swiper"
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
      >
        {indexes.map((index) => (
          <SwiperSlide key={index} className="bg-gray-50">
            {activeUser && <UserSlide index={index} onShow={onShowSlide} onHide={onHideSlide} user={activeUser} />}
          </SwiperSlide>
        ))}
      </Swiper>
      {(toLike || liked) && <LikeBadge />}
      {(toNope || noped) && <NopeBadge />}
    </div>
  );
};
