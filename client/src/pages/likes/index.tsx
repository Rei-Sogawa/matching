import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "./index.css";

import { FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Swiper as SwiperClass, Virtual } from "swiper";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";

type UserCardProps = {
  index: number;
  onShow: (index: number) => void;
  onHide: (index: number) => void;
};

const UserSwiperSlide: FC<UserCardProps> = ({ index, onShow, onHide }) => {
  const swiperSlide = useSwiperSlide();
  useEffect(() => {
    if (swiperSlide.isVisible) {
      onShow(index);
    } else {
      onHide(index);
    }
  }, [swiperSlide.isVisible]);
  return <div className="h-full flex justify-center items-center">{`Slide ${index}`}</div>;
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

  const onLike = () => {
    console.log("LIKE");
  };
  const onNope = () => {
    console.log("NOPE");
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
        effect="cards"
        virtual
        modules={[EffectCards, Virtual]}
        className="app-swiper"
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
      >
        {Array.from({ length: USER_CARD_LENGTH * 2 }).map((_, index) => (
          <SwiperSlide key={index} virtualIndex={index} className="bg-gray-200">
            <UserSwiperSlide index={index} onShow={onShowSlide} onHide={onHideSlide} />
          </SwiperSlide>
        ))}
      </Swiper>
      {toLike && <LikeBadge />}
      {toNope && <NopeBadge />}
    </div>
  );
};
