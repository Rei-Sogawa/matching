import { pathBuilder } from "@rei-sogawa/path-builder";

import { Index } from "./pages/Index";
import { LogIn } from "./pages/log-in";
import { SignUp } from "./pages/sign-up";

const INDEX = "/";
const SIGN_UP = "/sign-up";
const LOG_IN = "/log-in";

export const routes = {
  [INDEX]: {
    path: pathBuilder(INDEX),
    Component: Index,
  },
  [SIGN_UP]: {
    path: pathBuilder(SIGN_UP),
    Component: SignUp,
  },
  [LOG_IN]: {
    path: pathBuilder(LOG_IN),
    Component: LogIn,
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
