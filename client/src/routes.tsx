import { pathBuilder } from "@rei-sogawa/path-builder";

import { BeforeAuthenticated } from "./middleware/BeforeAuthenticated";
import { IndexPage } from "./pages/Index";
import { LikesPage } from "./pages/likes";
import { LogInPage } from "./pages/log-in";
import { SignUpPage } from "./pages/sign-up";

const INDEX_PATH = "/";
const SIGN_UP_PATH = "/sign-up";
const LOG_IN_PATH = "/log-in";
const LIKES_PATH = "/likes";

export const routes = {
  [INDEX_PATH]: {
    path: pathBuilder(INDEX_PATH),
    Component: IndexPage,
    middleware: [],
  },
  [SIGN_UP_PATH]: {
    path: pathBuilder(SIGN_UP_PATH),
    Component: SignUpPage,
    middleware: [BeforeAuthenticated],
  },
  [LOG_IN_PATH]: {
    path: pathBuilder(LOG_IN_PATH),
    Component: LogInPage,
    middleware: [BeforeAuthenticated],
  },
  [LIKES_PATH]: {
    path: pathBuilder(LIKES_PATH),
    Component: LikesPage,
    middleware: [],
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
