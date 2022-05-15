import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { FC } from "react";
import { BiArrowBack } from "react-icons/bi";
import { SetOptional } from "type-fest";

type BackButtonProps = SetOptional<IconButtonProps, "aria-label">;

export const BackButton: FC<BackButtonProps> = ({ ...rest }) => {
  return <IconButton size="sm" variant="ghost" aria-label="back" icon={<BiArrowBack fontSize="28px" />} {...rest} />;
};
