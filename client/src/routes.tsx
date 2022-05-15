import { pathBuilder } from "@rei-sogawa/path-builder";

import { Authenticated } from "./middleware/Authenticated";
import { BeforeAuthenticated } from "./middleware/BeforeAuthenticated";
import { IndexPage } from "./pages/Index";
import { LikesPage } from "./pages/likes";
import { LikePage } from "./pages/likes/[likeId]";
import { LikesSkippedPage } from "./pages/likes/skipped";
import { LogInPage } from "./pages/log-in";
import { MessageRoomsPage } from "./pages/message-rooms";
import { MessageRoomPage } from "./pages/message-rooms/[messageRoomId]";
import { MyPagePage } from "./pages/my-page";
import { MyPageLikesPage } from "./pages/my-page/likes";
import { MyPageProfileEditPage } from "./pages/my-page/profile/edit";
import { SearchUsersPage } from "./pages/search-users";
import { SearchUserPage } from "./pages/search-users/[userId]";
import { SignUpPage } from "./pages/sign-up";

const INDEX_PATH = "/";
const SIGN_UP_PATH = "/sign-up";
const LOG_IN_PATH = "/log-in";
const MY_PAGE = "/my-page";
const MY_PAGE_LIKES = "/my-page/likes";
const MY_PAGE_PROFILE_EDIT = "/my-page/profile/edit";
const SEARCH_USERS_PATH = "/search-users";
const SEARCH_USER_PATH = "/search-users/:userId";
const LIKES_PATH = "/likes";
const LIKES_SKIPPED_PATH = "/likes/skipped";
const LIKE_PATH = "/likes/:userId";
const MESSAGE_ROOMS_PATH = "/message-rooms";
const MESSAGE_ROOM_PATH = "/message-rooms/:messageRoomId";

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
  [SEARCH_USERS_PATH]: {
    path: pathBuilder(SEARCH_USERS_PATH),
    Component: SearchUsersPage,
    middleware: [Authenticated],
  },
  [SEARCH_USER_PATH]: {
    path: pathBuilder(SEARCH_USER_PATH),
    Component: SearchUserPage,
    middleware: [Authenticated],
  },
  [LIKES_PATH]: {
    path: pathBuilder(LIKES_PATH),
    Component: LikesPage,
    middleware: [Authenticated],
  },
  [LIKES_SKIPPED_PATH]: {
    path: pathBuilder(LIKES_SKIPPED_PATH),
    Component: LikesSkippedPage,
    middleware: [Authenticated],
  },
  [LIKE_PATH]: {
    path: pathBuilder(LIKE_PATH),
    Component: LikePage,
    middleware: [Authenticated],
  },
  [MESSAGE_ROOMS_PATH]: {
    path: pathBuilder(MESSAGE_ROOMS_PATH),
    Component: MessageRoomsPage,
    middleware: [Authenticated],
  },
  [MESSAGE_ROOM_PATH]: {
    path: pathBuilder(MESSAGE_ROOM_PATH),
    Component: MessageRoomPage,
    middleware: [Authenticated],
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
