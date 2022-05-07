import { gql } from "apollo-server-express";

export const typeDefs = gql`
scalar DateTime

enum Gender {
  FEMALE
  MALE
}

enum LikeStatus {
  MATCHED
  PENDING
  SKIPPED
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

type Message {
  content: String!
  createdAt: DateTime!
  id: ID!
  user: User!
}

type MessageConnection {
  edges: [MessageEdge!]!
  pageInfo: PageInfo!
}

type MessageEdge {
  cursor: DateTime!
  node: Message!
}

type MessageRoom {
  id: ID!
  messages(input: PageInput!): MessageConnection!
  partner: User!
}

type MessageRoomConnection {
  edges: [MessageRoomEdge!]!
  pageInfo: PageInfo!
}

type MessageRoomEdge {
  cursor: DateTime!
  node: MessageRoom!
}

type Mutation {
  access: Me!
  like(userId: ID!): User!
  signUp(input: SignUpInput!): Me!
  skip(userId: ID!): User!
  unlike(userId: ID!): User!
  updateUser(input: UpdateUserInput!): Me!
}

type PageInfo {
  endCursor: DateTime
  hasNextPage: Boolean
}

input PageInput {
  after: DateTime
  first: Int!
}

type Query {
  me: Me!
  messageRooms(input: PageInput!): MessageRoomConnection!
  newMessageRooms(input: PageInput!): MessageRoomConnection!
  receiveLikeUsers: [User!]!
  sendLikeUsers(input: PageInput!): UserConnection!
  user(id: ID!): User!
  users(input: PageInput!): UserConnection!
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

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  cursor: DateTime!
  node: User!
}
`;
