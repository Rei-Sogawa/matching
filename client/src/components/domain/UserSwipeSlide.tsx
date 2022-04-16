import { FC, useEffect, useState } from "react";
import { useSwiper, useSwiperSlide } from "swiper/react";

import { User } from "../../pages/likes";

type UseUserSwipeSlideOptions = { user: User; onShow: () => void; onHide: () => void };

const useUserSwipeSlide = ({ user, onShow, onHide }: UseUserSwipeSlideOptions) => {
  const swiper = useSwiper();
  const { isActive, isVisible } = useSwiperSlide();

  const [activeImage, setActiveImage] = useState(user.topImage);

  const onLike = () => {
    swiper.slidePrev(0);
  };
  const onNope = () => {
    swiper.slideNext(0);
  };

  useEffect(() => {
    if (isVisible) {
      onShow();
    } else {
      onHide();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isActive) return;
    setActiveImage(user.topImage);
  }, [user, isActive]);

  return {
    isActive,
    activeImage,
    setActiveImage,
    onLike,
    onNope,
  };
};

export type UserSwipeSlideProps = {
  onShow: () => void;
  onHide: () => void;
  user: User;
};

export const UserSwipeSlide: FC<UserSwipeSlideProps> = ({ onShow, onHide, user }) => {
  const { isActive, activeImage, setActiveImage, onLike, onNope } = useUserSwipeSlide({ onShow, onHide, user });

  if (!isActive)
    return (
      <div className="h-full flex justify-center items-center">
        <div className="font-bold text-xl">LOADING...</div>
      </div>
    );

  return (
    <div className="h-full py-10 flex flex-col space-y-4">
      <div className="h-3/4 w-full relative">
        <div className="absolute inset-0">
          <img src={activeImage} className="h-full mx-auto rounded-lg object-contain" />
        </div>
      </div>

      <div className="h-1/4 flex flex-col items-center space-y-4">
        <div className="swiper-no-swiping flex space-x-2">
          {user.images.map((image) => (
            <input
              key={image}
              type="radio"
              value={image}
              checked={image === activeImage}
              onChange={(e) => setActiveImage(e.target.value)}
              className="radio radio-accent"
            />
          ))}
        </div>

        <div className="font-bold">{user.displayName}</div>

        <div className="flex-1 flex justify-center items-center space-x-4">
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
