import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "./index.css";

import { FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Virtual } from "swiper";
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
    <div className="absolute top-1/4 left-3/4 z-10 origin-top rotate-12 px-3 py-2 border-4 rounded border-green-500 text-green-500 font-bold text-4xl">
      LIKE
    </div>
  );
};

const NopeBadge: FC = () => {
  return (
    <div className="absolute top-1/4 left-1/4 z-10 origin-top -rotate-12 px-3 py-2 border-4 rounded border-red-500 text-red-500 font-bold text-4xl">
      NOPE
    </div>
  );
};

export const Likes: FC = () => {
  const [visibleSlides, setVisibleSlides] = useState<number[]>([]);
  const onShow = (index: number) => setVisibleSlides((prev) => [...new Set([...prev, index])]);
  const onHide = (index: number) => setVisibleSlides((prev) => prev.filter((_index) => _index !== index));

  const [activeSlide, setActiveSlide] = useState<number>(0);
  useEffect(() => {
    if (visibleSlides.length === 1) setActiveSlide(visibleSlides[0]);
  }, [visibleSlides]);

  const toLike = useMemo(() => {
    if (visibleSlides.length === 2) {
      return visibleSlides.some((index) => index < activeSlide);
    }
    return false;
  }, [visibleSlides, activeSlide]);
  const toNope = useMemo(() => {
    if (visibleSlides.length === 2) {
      return visibleSlides.some((index) => index > activeSlide);
    }
    return false;
  }, [visibleSlides, activeSlide]);

  return (
    <div className="h-full bg-white relative">
      <Swiper
        effect="cards"
        virtual
        modules={[EffectCards, Virtual]}
        className="app-swiper"
        onSwiper={(swipe) => {
          swipe.slideTo(50);
        }}
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
