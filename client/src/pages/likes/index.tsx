import "swiper/css";
import "swiper/css/effect-cards";
import "./index.css";

import { FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Swiper as SwiperClass, Virtual } from "swiper";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

function getRandomArbitrary(max: number, min = 0) {
  return Math.random() * (max - min) + min;
}

type UserCardProps = {
  index: number;
  onShow: (index: number) => void;
  onHide: (index: number) => void;
};

const UserSwiperSlide: FC<UserCardProps> = ({ index, onShow, onHide }) => {
  const swiper = useSwiper();
  const onLike = () => {
    swiper.slidePrev(500);
  };
  const onNope = () => {
    swiper.slideNext(500);
  };

  const swiperSlide = useSwiperSlide();
  useEffect(() => {
    if (swiperSlide.isVisible) {
      onShow(index);
    } else {
      onHide(index);
    }
  }, [swiperSlide.isVisible]);

  const photoUrl = useMemo(() => `https://picsum.photos/seed/${getRandomArbitrary(1000)}/800/1200`, []);

  return (
    <div className="h-full flex flex-col space-y-2">
      <div className="h-3/4 mx-2 mt-2">
        <img src={photoUrl} className="h-full w-full object-cover" />
      </div>
      <div className="h-1/4 flex justify-center items-center space-x-4">
        <button className="btn btn-lg text-white" onClick={onNope}>
          nope
        </button>
        <button className="btn btn-lg btn-accent" onClick={onLike}>
          like
        </button>
      </div>
    </div>
  );
};

const LikeBadge: FC = () => {
  return (
    <div className="absolute top-1/4 right-1/4 z-10 origin-top -rotate-12 px-3 py-2 border-4 rounded border-green-500 text-green-500 font-bold text-5xl">
      LIKE
    </div>
  );
};

const NopeBadge: FC = () => {
  return (
    <div className="absolute top-1/4 left-1/4 z-10 origin-top rotate-12 px-3 py-2 border-4 rounded border-red-500 text-red-500 font-bold text-5xl">
      NOPE
    </div>
  );
};

export const Likes: FC = () => {
  const [visibleSlideIndexes, setVisibleSlideIndexes] = useState<number[]>([]);
  const onShowSlide = (index: number) => setVisibleSlideIndexes((prev) => [...new Set([...prev, index])]);
  const onHideSlide = (index: number) => setVisibleSlideIndexes((prev) => prev.filter((_index) => _index !== index));

  const USER_CARD_LENGTH = 50;
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(USER_CARD_LENGTH);

  const toLike = useMemo(() => {
    if (visibleSlideIndexes.length === 2) {
      return visibleSlideIndexes.some((index) => index < activeSlideIndex);
    }
    return false;
  }, [visibleSlideIndexes]);
  const toNope = useMemo(() => {
    if (visibleSlideIndexes.length === 2) {
      return visibleSlideIndexes.some((index) => index > activeSlideIndex);
    }
    return false;
  }, [visibleSlideIndexes]);

  const [liked, setLiked] = useState(false);
  const [noped, setNoped] = useState(false);

  const onLike = () => {
    console.log("LIKE");
    setLiked(true);
    setTimeout(() => setLiked(false), 250);
  };
  const onNope = () => {
    console.log("NOPE");
    setNoped(true);
    setTimeout(() => setNoped(false), 250);
  };

  const onSwiper = (swiper: SwiperClass) => {
    swiper.slideTo(USER_CARD_LENGTH);
  };
  const onSlideChange = (swiper: SwiperClass) => {
    if (activeSlideIndex > swiper.activeIndex) onLike();
    if (activeSlideIndex < swiper.activeIndex) onNope();

    // NOTE: activeSlideIndex の変更前後は visibleSlideIndexes が 2 つ存在し、toLike と toNope の切り替えがちらつく。setTimeout を使い、ちらつきを避ける
    setTimeout(() => {
      setActiveSlideIndex(swiper.activeIndex);
    }, 100);
  };

  return (
    <div className="h-full bg-white relative">
      <Swiper
        virtual
        effect="cards"
        modules={[EffectCards, Virtual]}
        speed={500}
        className="app-swiper"
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
      >
        {Array.from({ length: USER_CARD_LENGTH * 2 }).map((_, index) => (
          <SwiperSlide key={index} virtualIndex={index} className="bg-gray-50">
            <UserSwiperSlide index={index} onShow={onShowSlide} onHide={onHideSlide} />
          </SwiperSlide>
        ))}
      </Swiper>
      {(toLike || liked) && <LikeBadge />}
      {(toNope || noped) && <NopeBadge />}
    </div>
  );
};
