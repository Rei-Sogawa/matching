import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { FC } from "react";
import { BiShare } from "react-icons/bi";
import { SetOptional } from "type-fest";

type SkipButtonProps = SetOptional<IconButtonProps, "aria-label">;

export const SkipButton: FC<SkipButtonProps> = (props) => {
  return (
    <IconButton h="20" w="20" isRound boxShadow="md" aria-label="Skip" icon={<BiShare fontSize="28px" />} {...props} />
  );
};
