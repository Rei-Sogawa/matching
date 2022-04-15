import { FC, useEffect } from "react";
import { useSwiperSlide } from "swiper/react";

export type UserSwipePadSlideProps = {
  onShow: () => void;
  onHide: () => void;
};

export const UserSwipePadSlide: FC<UserSwipePadSlideProps> = ({ onShow, onHide }) => {
  const { isVisible } = useSwiperSlide();
  useEffect(() => {
    if (isVisible) {
      onShow();
    } else {
      onHide();
    }
  }, [isVisible]);
  return null;
};
