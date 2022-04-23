import { gql } from "apollo-server-express";

export const typeDefs = gql`
scalar DateTime

type Me {
  displayName: String!
  id: ID!
  photoPaths: [String!]!
  photoUrls: [String!]!
  topPhotoUrl: String
}

type Mutation {
  signUp(input: SignUpInput!): Me!
  updateUser(input: UpdateUserInput!): Me!
}

type Query {
  me: Me!
  users: [User!]!
}

input SignUpInput {
  displayName: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  displayName: String!
  photoPaths: [String!]!
}

type User {
  displayName: String!
  id: ID!
  photoUrls: [String!]!
  topPhotoUrl: String
}
`;
