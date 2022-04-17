import { Box, Button, Center, HStack, Image, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
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
  loading: boolean;
  user: User;
  onShow: () => void;
  onHide: () => void;
};

export const UserSwipeSlide: FC<UserSwipeSlideProps> = ({ loading, user, onShow, onHide }) => {
  const { isActive, activeImage, setActiveImage, onLike, onNope } = useUserSwipeSlide({ user, onShow, onHide });

  const isReady = useMemo(() => isActive && !loading, [isActive, loading]);

  return (
    <Box h="full">
      <Stack h="full" py="10" alignItems="center" spacing="4" hidden={!isReady}>
        <Image src={activeImage} h="75%" rounded="md" />

        <Stack h="25%">
          <RadioGroup colorScheme="gray" value={activeImage} onChange={setActiveImage}>
            <HStack justifyContent="center" className="swiper-no-swiping">
              {user.images.map((image) => (
                <Radio key={image} value={image} size="lg" />
              ))}
            </HStack>
          </RadioGroup>

          <Stack spacing="8">
            <Box alignSelf="center" fontWeight="bold">
              {user.displayName}
            </Box>
            <HStack spacing="4">
              <Button
                size="lg"
                w="28"
                color="white"
                bg="red.400"
                _hover={{ bg: "red.500" }}
                _active={{ bg: "red.500" }}
                onClick={onNope}
                leftIcon={<BiDislike />}
              >
                NOPE
              </Button>
              <Button
                size="lg"
                w="28"
                color="white"
                bg="green.400"
                _hover={{ bg: "green.500" }}
                _active={{ bg: "green.500" }}
                onClick={onLike}
                leftIcon={<BiLike />}
              >
                LIKE
              </Button>
            </HStack>
          </Stack>
        </Stack>
      </Stack>

      <Center h="full" fontWeight="bold" fontSize="xl" hidden={isReady}>
        LOADING...
      </Center>
    </Box>
  );
};
