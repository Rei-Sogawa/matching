import "./firebase-app";

import { ApolloServer } from "apollo-server-express";
import express from "express";
import expressPlayground from "graphql-playground-middleware-express";

import { Resolvers } from "./graphql/generated";
import { typeDefs } from "./graphql/typeDefs";

const resolvers: Resolvers = {
  Query: {
    hello: () => "Hello World",
  },
};

async function start() {
  const app = express();

  app.get("/", async (req, res) => {
    res.send("Hello World!.");
  });

  const server = new ApolloServer({ typeDefs, resolvers });
  server.start().then(() => {
    server.applyMiddleware({ app });
  });
  if (process.env.NODE_ENV !== "production") app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

  // NOTE: use port 3000 when local development, because firebase emulator firestore use port 8080
  app.listen({ port: process.env.PORT || 3000 }, () => console.log("GraphQL Server started!"));
}

start();
