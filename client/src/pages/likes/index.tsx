import "swiper/css";
import "swiper/css/effect-cards";
import "./index.css";

import { FC, useEffect, useMemo, useState } from "react";
import { EffectCards, Swiper as SwiperClass, Virtual } from "swiper";
import { Swiper, SwiperSlide, useSwiper, useSwiperSlide } from "swiper/react";

// const getRandomArbitrary = (max: number, min = 0) => {
//   return Math.random() * (max - min) + min;
// };

// type User = {
//   id: string;
//   displayName: string;
// };

// type UserCardProps = {
//   index: number;
//   onShow: (index: number) => void;
//   onHide: (index: number) => void;
//   user: User;
// };

// const UserSwiperSlide: FC<UserCardProps> = ({ index, onShow, onHide, user }) => {
//   const swiper = useSwiper();
//   const onLike = () => {
//     swiper.slidePrev(500);
//   };
//   const onNope = () => {
//     swiper.slideNext(500);
//   };

//   const swiperSlide = useSwiperSlide();
//   useEffect(() => {
//     if (swiperSlide.isVisible) {
//       onShow(index);
//     } else {
//       onHide(index);
//     }
//   }, [swiperSlide.isVisible]);

//   // const photoUrl = useMemo(() => `https://picsum.photos/seed/${getRandomArbitrary(1000)}/800/1200`, []);

//   return (
//     <div className="h-full flex flex-col space-y-2">
//       <div className="h-3/4 mx-2 mt-2">
//         {/* <img src={photoUrl} className="h-full w-full object-cover" /> */}
//         <div className="h-full flex justify-center items-center text-5xl">{user.displayName}</div>
//       </div>
//       <div className="h-1/4 flex justify-center items-center space-x-4">
//         <button className="btn btn-lg text-white" onClick={onNope}>
//           nope
//         </button>
//         <button className="btn btn-lg btn-success" onClick={onLike}>
//           like
//         </button>
//       </div>
//     </div>
//   );
// };

// export const Likes: FC = () => {
//   const [visibleSlideIndexes, setVisibleSlideIndexes] = useState<number[]>([]);
//   const onShowSlide = (index: number) => setVisibleSlideIndexes((prev) => [...new Set([...prev, index])]);
//   const onHideSlide = (index: number) => setVisibleSlideIndexes((prev) => prev.filter((_index) => _index !== index));

//   const USER_CARD_LENGTH = 50;
//   const [activeSlideIndex, setActiveSlideIndex] = useState<number>(USER_CARD_LENGTH);

//   const toLike = useMemo(() => {
//     if (visibleSlideIndexes.length === 2) {
//       return visibleSlideIndexes.some((index) => index < activeSlideIndex);
//     }
//     return false;
//   }, [visibleSlideIndexes]);

//   const toNope = useMemo(() => {
//     if (visibleSlideIndexes.length === 2) {
//       return visibleSlideIndexes.some((index) => index > activeSlideIndex);
//     }
//     return false;
//   }, [visibleSlideIndexes]);

//   const [liked, setLiked] = useState(false);
//   const [noped, setNoped] = useState(false);

//   const onLike = () => {
//     console.log("LIKE");
//     setLiked(true);
//     setTimeout(() => setLiked(false), 250);
//   };
//   const onNope = () => {
//     console.log("NOPE");
//     setNoped(true);
//     setTimeout(() => setNoped(false), 250);
//   };

//   const onSwiper = (swiper: SwiperClass) => {
//     swiper.slideTo(USER_CARD_LENGTH - 1);
//   };
//   const onSlideChange = (swiper: SwiperClass) => {
//     if (activeSlideIndex > swiper.activeIndex) onLike();
//     if (activeSlideIndex < swiper.activeIndex) onNope();

//     // NOTE: activeSlideIndex の変更前後は visibleSlideIndexes が 2 つ存在し、toLike と toNope の切り替えがちらつく。setTimeout を使い、ちらつきを避ける
//     setTimeout(() => {
//       setActiveSlideIndex(swiper.activeIndex);
//     }, 100);
//   };

//   const users = useMemo<User[]>(() => {
//     return Array.from({ length: USER_CARD_LENGTH }).map((_, index) => ({
//       id: index.toString(),
//       displayName: `user-${index}`,
//     }));
//   }, []);
//   const [userSlides, setUserSlides] = useState([...users.slice(1).reverse(), ...users]);

//   return (
//     <div className="h-full bg-white relative">
//       <Swiper
//         virtual
//         effect="cards"
//         modules={[EffectCards, Virtual]}
//         speed={500}
//         className="app-swiper"
//         onSwiper={onSwiper}
//         onSlideChange={onSlideChange}
//       >
//         {userSlides.map((user, index) => (
//           <SwiperSlide key={index} virtualIndex={index} className="bg-gray-50">
//             <UserSwiperSlide index={index} onShow={onShowSlide} onHide={onHideSlide} user={user} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//       {(toLike || liked) && <LikeBadge />}
//       {(toNope || noped) && <NopeBadge />}
//     </div>
//   );
// };

type User = {
  id: string;
  displayName: string;
};

type UserSlideProps = {
  user: User;
  index: number;
  onShow: (index: number) => void;
  onHide: (index: number) => void;
};

const UserSlide: FC<UserSlideProps> = ({ index, onShow, onHide, user }) => {
  const swiper = useSwiper();
  const onLike = () => {
    swiper.slidePrev(500);
  };
  const onNope = () => {
    swiper.slideNext(500);
  };

  const { isVisible } = useSwiperSlide();
  useEffect(() => {
    if (isVisible) {
      onShow(index);
    } else {
      onHide(index);
    }
  }, [isVisible]);

  return (
    <div className="h-full flex flex-col space-y-2">
      <div className="h-3/4 mx-2 mt-2">
        <div className="h-full flex justify-center items-center text-5xl">{user.displayName}</div>
      </div>
      <div className="h-1/4 flex justify-center items-center space-x-4">
        <button className="btn btn-lg text-white" onClick={onNope}>
          nope
        </button>
        <button className="btn btn-lg btn-success" onClick={onLike}>
          like
        </button>
      </div>
    </div>
  );
};

export const Likes: FC = () => {
  const USERS_COUNT = 10;
  const users: User[] = Array.from({ length: USERS_COUNT }).map((_, index) => ({
    id: index.toString(),
    displayName: `user-${index}`,
  }));

  const [userSlides, setUserSlides] = useState([...users.slice(1).reverse(), ...users]);
  const [activeUserSlideIndex, setActiveUserSlideIndex] = useState(USERS_COUNT - 1);

  const [visibleUserSlideIndexes, setVisibleUserSlideIndexes] = useState([USERS_COUNT - 1]);

  const onShowUserSlide = (index: number) => setVisibleUserSlideIndexes((prev) => [...new Set([...prev, index])]);
  const onHideUserSlide = (index: number) =>
    setVisibleUserSlideIndexes((prev) => prev.filter((_index) => _index !== index));

  const onSwiper = (swiper: SwiperClass) => {
    swiper.slideTo(USERS_COUNT - 1);
  };

  return (
    <div className="h-full bg-white relative">
      <Swiper effect="cards" modules={[EffectCards, Virtual]} speed={500} className="app-swiper" onSwiper={onSwiper}>
        {userSlides.map((user, index) => (
          <SwiperSlide key={index} className="bg-gray-50">
            <UserSlide user={user} index={index} onShow={onShowUserSlide} onHide={onHideUserSlide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
