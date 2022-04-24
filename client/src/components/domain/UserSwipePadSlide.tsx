import { Box, Center } from "@chakra-ui/react";
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
  return (
    <Box h="full">
      <Center h="full" fontWeight="bold" fontSize="xl">
        LOADING...
      </Center>
    </Box>
  );
};
