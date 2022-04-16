import classNames from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import { useSwiper, useSwiperSlide } from "swiper/react";

import { User } from "../../pages/likes";

type UseUserSwipeSlideOptions = { loading: boolean; user: User; onShow: () => void; onHide: () => void };

const useUserSwipeSlide = ({ loading, user, onShow, onHide }: UseUserSwipeSlideOptions) => {
  const swiper = useSwiper();
  const { isActive, isVisible } = useSwiperSlide();

  const [activeImage, setActiveImage] = useState(user.topImage);

  const isReady = useMemo(() => isActive && !loading, [isActive, loading]);

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
    activeImage,
    isReady,
    setActiveImage,
    onLike,
    onNope,
  };
};

export type UserSwipeSlideProps = {
  loading: boolean;
  user: User;
  onShow: () => void;
  onHide: () => void;
};

export const UserSwipeSlide: FC<UserSwipeSlideProps> = ({ loading, user, onShow, onHide }) => {
  const { activeImage, isReady, setActiveImage, onLike, onNope } = useUserSwipeSlide({ loading, user, onShow, onHide });

  return (
    <>
      <div className={classNames("h-full py-10 flex flex-col space-y-4", { hidden: !isReady })}>
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

      <div className={classNames("h-full flex justify-center items-center", { hidden: isReady })}>
        <div className="font-bold text-xl">LOADING...</div>
      </div>
    </>
  );
};
