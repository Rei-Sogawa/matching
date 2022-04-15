import "./firebase-app";

import { ApolloServer } from "apollo-server-express";
import express from "express";
import expressPlayground from "graphql-playground-middleware-express";

import { serverContext } from "./context";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./resolvers";

async function start() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers, context: serverContext });
  server.start().then(() => {
    server.applyMiddleware({ app });
  });
  if (process.env.NODE_ENV !== "production") app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  // NOTE: use port 3001 when local development, because firebase emulator firestore use port 8080
  app.listen({ port: process.env.PORT || 3001 }, () => console.log("GraphQL Server started!"));
}

start();
