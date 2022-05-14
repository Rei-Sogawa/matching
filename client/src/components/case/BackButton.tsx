import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { FC } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { SetOptional } from "type-fest";

type BackButtonProps = {
  path: string;
} & SetOptional<IconButtonProps, "aria-label">;

export const BackButton: FC<BackButtonProps> = ({ path, ...rest }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      size="sm"
      variant="ghost"
      aria-label="back"
      icon={<BiArrowBack fontSize="28px" />}
      // TODO: 親から渡す
      onClick={() => navigate(path)}
      {...rest}
    />
  );
};
