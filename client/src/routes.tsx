import { pathBuilder } from "@rei-sogawa/path-builder";

import { Authenticated } from "./middleware/Authenticated";
import { BeforeAuthenticated } from "./middleware/BeforeAuthenticated";
import { IndexPage } from "./pages/Index";
import { LikesPage } from "./pages/likes";
import { LikePage } from "./pages/likes/[likeId]";
import { LogInPage } from "./pages/log-in";
import { MessagesPage } from "./pages/messages";
import { MyPagePage } from "./pages/my-page";
import { MyPageLikesPage } from "./pages/my-page/likes";
import { MyPageProfileEditPage } from "./pages/my-page/profile/edit";
import { SignUpPage } from "./pages/sign-up";
import { UsersPage } from "./pages/users";
import { UserPage } from "./pages/users/[userId]";

const INDEX_PATH = "/";
const SIGN_UP_PATH = "/sign-up";
const LOG_IN_PATH = "/log-in";
const MY_PAGE = "/my-page";
const MY_PAGE_LIKES = "/my-page/likes";
const MY_PAGE_PROFILE_EDIT = "/my-page/profile/edit";
const USERS_PATH = "/users";
const USER_PATH = "/users/:userId";
const LIKES_PATH = "/likes";
const LIKE_PATH = "/likes/:userId";
const MESSAGES_PATH = "/messages";

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
  [MY_PAGE_LIKES]: {
    path: pathBuilder(MY_PAGE_LIKES),
    Component: MyPageLikesPage,
    middleware: [Authenticated],
  },
  [MY_PAGE_PROFILE_EDIT]: {
    path: pathBuilder(MY_PAGE_PROFILE_EDIT),
    Component: MyPageProfileEditPage,
    middleware: [Authenticated],
  },
  [USERS_PATH]: {
    path: pathBuilder(USERS_PATH),
    Component: UsersPage,
    middleware: [Authenticated],
  },
  [USER_PATH]: {
    path: pathBuilder(USER_PATH),
    Component: UserPage,
    middleware: [Authenticated],
  },
  [LIKES_PATH]: {
    path: pathBuilder(LIKES_PATH),
    Component: LikesPage,
    middleware: [Authenticated],
  },
  [LIKE_PATH]: {
    path: pathBuilder(LIKE_PATH),
    Component: LikePage,
    middleware: [Authenticated],
  },
  [MESSAGES_PATH]: {
    path: pathBuilder(MESSAGES_PATH),
    Component: MessagesPage,
    middleware: [Authenticated],
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
