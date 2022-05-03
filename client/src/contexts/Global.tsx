import { useState } from "react";
import { createContainer } from "unstated-next";

import { UserForUsersPageUserCardFragment } from "../graphql/generated";

const useGlobalContainer = () => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [users, setUsers] = useState<UserForUsersPageUserCardFragment[]>([]);

  return {
    redirect,
    setRedirect,
    users,
    setUsers,
  };
};

const globalContainer = createContainer(useGlobalContainer);
export const GlobalProvider = globalContainer.Provider;
export const useGlobal = globalContainer.useContainer;
