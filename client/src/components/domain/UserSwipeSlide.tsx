import { gql } from "@apollo/client";
import { Box, Button, Center, HStack, Image, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { head } from "lodash-es";
import { FC, useEffect, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import { useSwiper, useSwiperSlide } from "swiper/react";

import { UserForUserSwipeSlideFragment } from "../../graphql/generated";

gql`
  fragment UserForUserSwipeSlide on User {
    id
    displayName
    photoUrls
  }
`;

type UseUserSwipeSlideOptions = { onShow: () => void; onHide: () => void };

const useUserSwipeSlide = ({ onShow, onHide }: UseUserSwipeSlideOptions) => {
  const swiper = useSwiper();
  const { isVisible } = useSwiperSlide();

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

  return {
    onLike,
    onNope,
  };
};

const useUserPhotos = (user: UserForUserSwipeSlideFragment | undefined) => {
  const { isActive } = useSwiperSlide();

  const [activePhoto, setActivePhoto] = useState<string>();

  useEffect(() => {
    if (!isActive || !user) return;
    setActivePhoto(head(user.photoUrls));
  }, [user, isActive]);

  return { activePhoto, setActivePhoto };
};

export type UserSwipeSlideProps = {
  loading: boolean;
  user: UserForUserSwipeSlideFragment | undefined;
  onShow: () => void;
  onHide: () => void;
};

export const UserSwipeSlide: FC<UserSwipeSlideProps> = ({ loading, user, onShow, onHide }) => {
  const { isActive } = useSwiperSlide();

  const { onLike, onNope } = useUserSwipeSlide({ onShow, onHide });
  const { activePhoto, setActivePhoto } = useUserPhotos(user);

  const isReady = isActive && !loading;

  return (
    <Box h="full">
      {user && isActive && !loading ? (
        <Stack h="full" py="10" alignItems="center" spacing="4">
          <Box h="75%">
            <Image src={activePhoto} h="full" rounded="md" objectFit="contain" />
          </Box>

          <Stack h="25%">
            <RadioGroup value={activePhoto} onChange={setActivePhoto}>
              <HStack justifyContent="center" className="swiper-no-swiping">
                {user.photoUrls.map((url) => (
                  <Radio key={url} value={url} size="lg" />
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
                  colorScheme="danger"
                  className="swiper-no-swiping"
                  onClick={onNope}
                  leftIcon={<BiDislike />}
                >
                  NOPE
                </Button>
                <Button
                  size="lg"
                  w="28"
                  colorScheme="primary"
                  className="swiper-no-swiping"
                  onClick={onLike}
                  leftIcon={<BiLike />}
                >
                  LIKE
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <Center h="full" fontWeight="bold" fontSize="xl" hidden={isReady}>
          LOADING...
        </Center>
      )}
    </Box>
  );
};
