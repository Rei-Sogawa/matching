import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { FC } from "react";
import { BiLike } from "react-icons/bi";
import { SetOptional } from "type-fest";

type LikeButtonProps = SetOptional<IconButtonProps, "aria-label">;

export const LikeButton: FC<LikeButtonProps> = (props) => {
  return (
    <IconButton
      colorScheme="secondary"
      h="20"
      w="20"
      isRound
      boxShadow="md"
      aria-label="like"
      icon={<BiLike fontSize="28px" />}
      {...props}
    />
  );
};
