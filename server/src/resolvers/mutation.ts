import { cancelLikeMutation } from "../core/like/mutation/cancel-like";
import { createLikeMutation } from "../core/like/mutation/create-like";
import { matchLikeMutation } from "../core/like/mutation/match-like";
import { matchSkippedLikeMutation } from "../core/like/mutation/match-skipped-like";
import { skipLikeMutation } from "../core/like/mutation/skip-like";
import { createMessageMutation } from "../core/message-room/mutation/create-message";
import { signUpMutation } from "../core/user/mutation/sign-up";
import { updateUserLastAccessMutation } from "../core/user/mutation/update-user-last-access";
import { updateUserProfileMutation } from "../core/user/mutation/update-user-profile";
import { Resolvers } from "../graphql/generated";

export const Mutation: Resolvers["Mutation"] = {
  signUp: signUpMutation,
  updateUserProfile: updateUserProfileMutation,
  updateUserLastAccess: updateUserLastAccessMutation,

  createLike: createLikeMutation,
  cancelLike: cancelLikeMutation,
  skipLike: skipLikeMutation,
  matchLike: matchLikeMutation,
  matchSkippedLike: matchSkippedLikeMutation,

  createMessage: createMessageMutation,
};
