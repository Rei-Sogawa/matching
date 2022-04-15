import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";
import { FC, useEffect, useMemo, useState } from "react";
import useMountedState from "react-use/lib/useMountedState";
import { useSwiper, useSwiperSlide } from "swiper/react";

import { User } from "../../pages/likes";

type UseUserSwipeSlideOptions = { user: User; onShow: () => void; onHide: () => void };

const useUserSwipeSlide = ({ user, onShow, onHide }: UseUserSwipeSlideOptions) => {
  const swiper = useSwiper();
  const { isActive, isVisible } = useSwiperSlide();

  const [activeImage, setActiveImage] = useState(user.topImage);

  const [loading, setLoading] = useState(false);
  const isReady = useMemo(() => isActive && !loading, [isActive, loading]);

  const isMounted = useMountedState();

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
    setLoading(true);
    setTimeout(() => {
      if (!isMounted()) return;
      setLoading(false);
    }, 500);
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
  onShow: () => void;
  onHide: () => void;
  user: User;
};

export const UserSwipeSlide: FC<UserSwipeSlideProps> = ({ onShow, onHide, user }) => {
  const { onLike, onNope, activeImage, setActiveImage, isReady } = useUserSwipeSlide({ onShow, onHide, user });

  return (
    <>
      <div className={classNames("h-full py-10 flex flex-col space-y-4", { hidden: !isReady })}>
        <div className="h-3/4 w-full relative">
          <div className="absolute inset-0">
            <img src={activeImage} className="h-full mx-auto rounded-lg object-contain" />
          </div>
        </div>

        <div className="h-1/4 flex flex-col items-center space-y-4">
          {/* NOTE: radio button の touch で swipe が反応しないようにするため swiper-no-swiping class を指定
                    https://swiperjs.com/swiper-api#param-noSwiping */}
          <RadioGroup value={activeImage} onChange={setActiveImage} className="swiper-no-swiping flex space-x-2">
            {user.images.map((image) => (
              <RadioGroup.Option key={image} value={image}>
                {({ checked }) => (
                  <input
                    type="radio"
                    checked={checked}
                    // NOTE: controlled component なので、onChange を指定しないと warning が出る
                    onChange={() => {
                      return;
                    }}
                    className="radio radio-accent"
                  />
                )}
              </RadioGroup.Option>
            ))}
          </RadioGroup>

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
