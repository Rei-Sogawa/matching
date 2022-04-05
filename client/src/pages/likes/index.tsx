import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "./index.css";

import { FC, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { EffectCards, Swiper as SwiperClass, Virtual } from "swiper";
import { Swiper, SwiperSlide, useSwiperSlide } from "swiper/react";

type UserCardProps = {
  index: number;
  onShow: (index: number) => void;
  onHide: (index: number) => void;
};

const UserCard: FC<UserCardProps> = ({ index, onShow, onHide }) => {
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
    <div className="absolute top-1/4 right-1/4 z-10 origin-top rotate-12 px-3 py-2 border-4 rounded border-green-500 text-green-500 font-bold text-5xl">
      LIKE
    </div>
  );
};

const NopeBadge: FC = () => {
  return (
    <div className="absolute top-1/4 left-1/4 z-10 origin-top -rotate-12 px-3 py-2 border-4 rounded border-red-500 text-red-500 font-bold text-5xl">
      NOPE
    </div>
  );
};

export const Likes: FC = () => {
  const [visibleSlideIndexes, setVisibleSlideIndexes] = useState<number[]>([]);
  const onShow = (index: number) => setVisibleSlideIndexes((prev) => [...new Set([...prev, index])]);
  const onHide = (index: number) => setVisibleSlideIndexes((prev) => prev.filter((_index) => _index !== index));

  const DEFAULT_INDEX = 50;
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(DEFAULT_INDEX);

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
    swiper.slideTo(DEFAULT_INDEX);
  };
  const onSlideChange = (swiper: SwiperClass) => {
    if (activeSlideIndex > swiper.activeIndex) onLike();
    if (activeSlideIndex < swiper.activeIndex) onNope();
    // NOTE: activeSlideIndex が変更された直後は visibleSlideIndexes が 2 つ存在し、toLike と toNope の切り替えがちらつくため、setTimeout を使っている
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
        {Array.from({ length: 100 }).map((_, index) => (
          <SwiperSlide key={index} virtualIndex={index} className="bg-gray-200">
            <UserCard index={index} onShow={onShow} onHide={onHide} />
          </SwiperSlide>
        ))}
      </Swiper>
      {toLike && <LikeBadge />}
      {toNope && <NopeBadge />}
    </div>
  );
};
