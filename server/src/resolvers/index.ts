import { Resolvers } from "../graphql/generated";
import * as CustomScalars from "./custom-scalars";
import { Mutation } from "./mutation";
import { Query } from "./query";

export const resolvers: Resolvers = {
  Query,
  Mutation,
  ...CustomScalars,
};
