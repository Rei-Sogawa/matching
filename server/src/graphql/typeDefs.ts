import { gql } from "apollo-server-express";

export const typeDefs = gql`
scalar DateTime

enum Gender {
  FEMALE
  MALE
}

type Me {
  age: Int!
  gender: Gender!
  id: ID!
  livingPref: String!
  nickName: String!
  photoPaths: [String!]!
  photoUrls: [String!]!
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
  email: String!
  password: String!
}

input UpdateUserInput {
  age: Int!
  gender: Gender!
  livingPref: String!
  nickName: String!
  photoPaths: [String!]!
}

type User {
  age: Int!
  gender: Gender!
  id: ID!
  livingPref: String!
  nickName: String!
  photoUrls: [String!]!
}
`;
