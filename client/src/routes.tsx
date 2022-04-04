import { pathBuilder } from "@rei-sogawa/path-builder";

import { WithoutAuth } from "./components/functional/WithoutAuth";
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
    middleware: [],
  },
  [SIGN_UP]: {
    path: pathBuilder(SIGN_UP),
    Component: SignUp,
    middleware: [WithoutAuth],
  },
  [LOG_IN]: {
    path: pathBuilder(LOG_IN),
    Component: LogIn,
    middleware: [WithoutAuth],
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
