import { Resolvers } from "../graphql/generated";
import { accessMutation } from "../usecase/mutation/accessMutation";
import { createMessageMutation } from "../usecase/mutation/createMessageMutation";
import { likeMutation } from "../usecase/mutation/likeMutation";
import { signUpMutation } from "../usecase/mutation/signUpMutation";
import { skipMutation } from "../usecase/mutation/skipMutation";
import { unlikeMutation } from "../usecase/mutation/unlikeMutation";
import { updateUserMutation } from "../usecase/mutation/updateUserMutation";

export const Mutation: Resolvers["Mutation"] = {
  signUp: signUpMutation,
  access: accessMutation,
  updateUser: updateUserMutation,
  like: likeMutation,
  unlike: unlikeMutation,
  skip: skipMutation,
  createMessage: createMessageMutation,
};
