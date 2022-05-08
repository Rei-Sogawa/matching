import "./firebase-app";

import { ApolloServer } from "apollo-server";

import { serverContext } from "./context";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: serverContext,
});

server.listen({ port: process.env.PORT || 3001 }).then(({ url }) => {
  console.log(`Graphql Server ready at ${url}`);
});
