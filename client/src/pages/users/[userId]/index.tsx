import { Box, Button } from "@chakra-ui/react";
import { FC } from "react";

import { BackButton } from "../../../components/common/BackButton";
import { AppLayout } from "../../../layouts/AppLayout";
import { routes } from "../../../routes";

export const UserPage: FC = () => {
  return (
    <AppLayout footer={false}>
      <BackButton path={routes["/users"].path()} />
    </AppLayout>
  );
};
