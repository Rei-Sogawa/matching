import { gql } from "@apollo/client";
import { Box, Button, Center, HStack, Image, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { head } from "lodash-es";
import { FC, useEffect, useMemo, useState } from "react";
import { BiDislike, BiLike } from "react-icons/bi";
import { useSwiper, useSwiperSlide } from "swiper/react";

import { User, UserForUserSwipeSlideFragment } from "../../graphql/generated";
import { useIsMounted } from "../../hooks/useIsMounted";

gql`
  fragment UserForUserSwipeSlide on User {
    id
    displayName
    photoPaths
  }
`;

type UseUserSwipeSlideOptions = { onShow: () => void; onHide: () => void };

const useUserSwipeSlide = ({ onShow, onHide }: UseUserSwipeSlideOptions) => {
  const swiper = useSwiper();
  const { isActive, isVisible } = useSwiperSlide();

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
    isActive,
    onLike,
    onNope,
  };
};

const useUserPhotos = (user: UserForUserSwipeSlideFragment) => {
  const { isActive } = useSwiperSlide();
  const isMounted = useIsMounted();

  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [activePhoto, setActivePhoto] = useState<string>();

  useEffect(() => {
    if (!isActive) return;

    (async () => {
      setPhotoUrls([]);
      setActivePhoto(undefined);

      // NOTE: 本当は server 側でここの処理してほしいけど、emulator で admin-sdk の storage 上手く扱えずに諦めた
      //       "bucket name not specified or invalid." となる
      const _photoUrls = await Promise.all(user.photoPaths.map((path) => getDownloadURL(ref(getStorage(), path))));

      if (!isMounted()) return;

      setPhotoUrls(_photoUrls);
      setActivePhoto(head(_photoUrls));
    })();
  }, [user, isActive]);

  return { photoUrls, activePhoto, setActivePhoto };
};

export type UserSwipeSlideProps = {
  loading: boolean;
  user: User;
  onShow: () => void;
  onHide: () => void;
};

export const UserSwipeSlide: FC<UserSwipeSlideProps> = ({ loading, user, onShow, onHide }) => {
  const { isActive, onLike, onNope } = useUserSwipeSlide({ onShow, onHide });

  const isReady = useMemo(() => isActive && !loading, [isActive, loading]);

  const { photoUrls, activePhoto, setActivePhoto } = useUserPhotos(user);

  return (
    <Box h="full">
      <Stack h="full" py="10" alignItems="center" spacing="4" hidden={!isReady}>
        <Box h="75%">
          <Image src={activePhoto} h="full" rounded="md" objectFit="contain" />
        </Box>

        <Stack h="25%">
          <RadioGroup value={activePhoto} onChange={setActivePhoto}>
            <HStack justifyContent="center" className="swiper-no-swiping">
              {photoUrls.map((url) => (
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

      <Center h="full" fontWeight="bold" fontSize="xl" hidden={isReady}>
        LOADING...
      </Center>
    </Box>
  );
};
