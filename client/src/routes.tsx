import { pathBuilder } from "@rei-sogawa/path-builder";

import { withAuthenticated } from "./hocs/withAuthenticated";
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

export const routes = {
  "/": {
    path: pathBuilder("/"),
    Component: IndexPage,
  },
  "/sign-up": {
    path: pathBuilder("/sign-up"),
    Component: SignUpPage,
  },
  "/log-in": {
    path: pathBuilder("/log-in"),
    Component: LogInPage,
  },
  "/my-page": {
    path: pathBuilder("/my-page"),
    Component: withAuthenticated(MyPagePage),
  },
  "/my-page/likes": {
    path: pathBuilder("/my-page/likes"),
    Component: withAuthenticated(MyPageLikesPage),
  },
  "/my-page/profile/edit": {
    path: pathBuilder("/my-page/profile/edit"),
    Component: withAuthenticated(MyPageProfileEditPage),
  },
  "/search-users": {
    path: pathBuilder("/search-users"),
    Component: withAuthenticated(SearchUsersPage),
  },
  "/search-users/:userId": {
    path: pathBuilder("/search-users/:userId"),
    Component: withAuthenticated(SearchUserPage),
  },
  "/likes": {
    path: pathBuilder("/likes"),
    Component: withAuthenticated(LikesPage),
  },
  "/likes/skipped": {
    path: pathBuilder("/likes/skipped"),
    Component: withAuthenticated(LikesSkippedPage),
  },
  "/likes/:userId": {
    path: pathBuilder("/likes/:userId"),
    Component: withAuthenticated(LikePage),
  },
  "/message-rooms": {
    path: pathBuilder("/message-rooms"),
    Component: withAuthenticated(MessageRoomsPage),
  },
  "/message-rooms/:messageRoomId": {
    path: pathBuilder("/message-rooms/:messageRoomId"),
    Component: withAuthenticated(MessageRoomPage),
  },
};

export const paths = Object.keys(routes) as (keyof typeof routes)[];
