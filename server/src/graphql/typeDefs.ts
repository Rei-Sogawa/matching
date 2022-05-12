import { gql } from "apollo-server";

export const typeDefs = gql`
input CreateMessageInput {
  content: String!
  messageRoomId: ID!
}

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
  mine: Boolean!
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
  latestMessage: Message!
  messages(input: PageInput!): MessageConnection!
  opened: Boolean!
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
  cancelLike(likeId: ID!): User!
  createLike(userId: ID!): User!
  createMessage(input: CreateMessageInput!): Message!
  matchLike(likeId: ID!): User!
  signUp(input: SignUpInput!): Me!
  skipLike(likeId: ID!): User!
  updateUserLastAccess: Me!
  updateUserProfile(input: UpdateUserInput!): Me!
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
  message(messageId: ID!): Message!
  messageRoom(messageRoomId: ID!): MessageRoom!
  newMessageRooms(input: PageInput!): MessageRoomConnection!
  openedMessageRooms(input: PageInput!): MessageRoomConnection!
  receiveLikeUsers: [User!]!
  sendLikeUsers(input: PageInput!): UserConnection!
  user(userId: ID!): User!
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
  topPhotoUrl: String
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
