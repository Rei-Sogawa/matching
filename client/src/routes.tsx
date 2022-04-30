import { pathBuilder } from "@rei-sogawa/path-builder";

import { Authenticated } from "./middleware/Authenticated";
import { BeforeAuthenticated } from "./middleware/BeforeAuthenticated";
import { IndexPage } from "./pages/Index";
import { LogInPage } from "./pages/log-in";
import { MyPagePage } from "./pages/my-page";
import { MyPageProfileEditPage } from "./pages/my-page/profile/edit";
import { SignUpPage } from "./pages/sign-up";

const INDEX_PATH = "/";
const SIGN_UP_PATH = "/sign-up";
const LOG_IN_PATH = "/log-in";
const MY_PAGE = "/my-page";
const MY_PAGE_PROFILE_EDIT = "/my-page/profile/edit";

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
  [MY_PAGE]: {
    path: pathBuilder(MY_PAGE),
    Component: MyPagePage,
    middleware: [Authenticated],
  },
  [MY_PAGE_PROFILE_EDIT]: {
    path: pathBuilder(MY_PAGE_PROFILE_EDIT),
    Component: MyPageProfileEditPage,
    middleware: [Authenticated],
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
