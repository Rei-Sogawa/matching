import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "./index.css";

import { FC, useEffect } from "react";
import { EffectCards, Virtual } from "swiper";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

const UserCard: FC<{ index: number }> = ({ index }) => {
  const swiper = useSwiper();
  const swiperSlide = useSwiperSlide();
  useEffect(() => {
    console.log(index);
    return () => {
      console.log(index);
    };
  }, []);
  return <div className="h-full flex justify-center items-center">{`Slide ${index}`}</div>;
};

export const Likes: FC = () => {
  return (
    <div className="h-full bg-white">
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
            <UserCard index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
