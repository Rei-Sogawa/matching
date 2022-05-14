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
  cancelLike(userId: ID!): User!
  createLike(userId: ID!): User!
  createMessage(input: CreateMessageInput!): Message!
  matchLike(userId: ID!): User!
  signUp(input: SignUpInput!): Me!
  skipLike(userId: ID!): User!
  updateUserLastAccess: Me!
  updateUserProfile(input: UpdateUserProfileInput!): Me!
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
  viewer: Viewer!
}

input SignUpInput {
  email: String!
  password: String!
}

input UpdateUserProfileInput {
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

type Viewer {
  me: Me!
  message(messageId: ID!): Message!
  messageRoom(messageRoomId: ID!): MessageRoom!
  newMessageRooms(input: PageInput!): MessageRoomConnection!
  openedMessageRooms(input: PageInput!): MessageRoomConnection!
  receiveLikeUsers: [User!]!
  sendLikeUsers(input: PageInput!): UserConnection!
  uid: ID!
  user(userId: ID!): User!
  users(input: PageInput!): UserConnection!
}
`;
