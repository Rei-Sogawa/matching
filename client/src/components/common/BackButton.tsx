import { IconButton } from "@chakra-ui/react";
import { FC } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  path: string;
};

export const BackButton: FC<BackButtonProps> = ({ path }) => {
  const navigate = useNavigate();

  return (
    <IconButton
      size="sm"
      variant="ghost"
      aria-label="back"
      icon={<BiArrowBack fontSize="28px" />}
      onClick={() => navigate(path)}
    />
  );
};
