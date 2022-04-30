import { pathBuilder } from "@rei-sogawa/path-builder";

import { Authenticated } from "./middleware/Authenticated";
import { AuthorizeUser } from "./middleware/AuthorizeUser";
import { BeforeAuthenticated } from "./middleware/BeforeAuthenticated";
import { IndexPage } from "./pages/Index";
import { LogInPage } from "./pages/log-in";
import { MyPage } from "./pages/my-page";
import { SignUpPage } from "./pages/sign-up";
import { UserEditPage } from "./pages/users/[userId]/edit";

const INDEX_PATH = "/";
const SIGN_UP_PATH = "/sign-up";
const LOG_IN_PATH = "/log-in";
const MY_PAGE = "/my-page";
const USER_EDIT_PATH = "/users/:userId/edit";

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
  [USER_EDIT_PATH]: {
    path: pathBuilder(USER_EDIT_PATH),
    Component: UserEditPage,
    middleware: [Authenticated, AuthorizeUser],
  },
  [MY_PAGE]: {
    path: pathBuilder(MY_PAGE),
    Component: MyPage,
    middleware: [Authenticated],
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
