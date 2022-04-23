import { useState } from "react";
import { createContainer } from "unstated-next";

const useGlobalContainer = () => {
  const [redirect, setRedirect] = useState<string | null>(null);

  return {
    redirect,
    setRedirect,
  };
};

const globalContainer = createContainer(useGlobalContainer);
export const GlobalProvider = globalContainer.Provider;
export const useGlobal = globalContainer.useContainer;
