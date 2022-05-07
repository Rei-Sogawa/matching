import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: string;
};

export type CreateMessageInput = {
  content: Scalars['String'];
  messageRoomId: Scalars['String'];
};

export const Gender = {
  Female: 'FEMALE',
  Male: 'MALE'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];
export const LikeStatus = {
  Matched: 'MATCHED',
  Pending: 'PENDING',
  Skipped: 'SKIPPED'
} as const;

export type LikeStatus = typeof LikeStatus[keyof typeof LikeStatus];
export type Me = {
  __typename?: 'Me';
  age: Scalars['Int'];
  gender: Gender;
  id: Scalars['ID'];
  livingPref: Scalars['String'];
  nickName: Scalars['String'];
  photoPaths: Array<Scalars['String']>;
  photoUrls: Array<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  mine: Scalars['Boolean'];
  user: User;
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  edges: Array<MessageEdge>;
  pageInfo: PageInfo;
};

export type MessageEdge = {
  __typename?: 'MessageEdge';
  cursor: Scalars['DateTime'];
  node: Message;
};

export type MessageRoom = {
  __typename?: 'MessageRoom';
  id: Scalars['ID'];
  lastMessage: Message;
  messages: MessageConnection;
  partner: User;
};


export type MessageRoomMessagesArgs = {
  input: PageInput;
};

export type MessageRoomConnection = {
  __typename?: 'MessageRoomConnection';
  edges: Array<MessageRoomEdge>;
  pageInfo: PageInfo;
};

export type MessageRoomEdge = {
  __typename?: 'MessageRoomEdge';
  cursor: Scalars['DateTime'];
  node: MessageRoom;
};

export type Mutation = {
  __typename?: 'Mutation';
  access: Me;
  createMessage: Message;
  like: User;
  signUp: Me;
  skip: User;
  unlike: User;
  updateUser: Me;
};


export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
};


export type MutationLikeArgs = {
  userId: Scalars['ID'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSkipArgs = {
  userId: Scalars['ID'];
};


export type MutationUnlikeArgs = {
  userId: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['DateTime']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

export type PageInput = {
  after?: InputMaybe<Scalars['DateTime']>;
  first: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  me: Me;
  messageRooms: MessageRoomConnection;
  newMessageRooms: MessageRoomConnection;
  receiveLikeUsers: Array<User>;
  sendLikeUsers: UserConnection;
  user: User;
  users: UserConnection;
};


export type QueryMessageRoomsArgs = {
  input: PageInput;
};


export type QueryNewMessageRoomsArgs = {
  input: PageInput;
};


export type QuerySendLikeUsersArgs = {
  input: PageInput;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  input: PageInput;
};

export type SignUpInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
};

export type UpdateUserInput = {
  age: Scalars['Int'];
  gender: Gender;
  livingPref: Scalars['String'];
  nickName: Scalars['String'];
  photoPaths: Array<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  age: Scalars['Int'];
  gender: Gender;
  id: Scalars['ID'];
  livingPref: Scalars['String'];
  nickName: Scalars['String'];
  photoUrls: Array<Scalars['String']>;
  topPhotoUrl?: Maybe<Scalars['String']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['DateTime'];
  node: User;
};

export type AccessMutationVariables = Exact<{ [key: string]: never; }>;


export type AccessMutation = { __typename?: 'Mutation', access: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type UserActionCardFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, topPhotoUrl?: string | null };

export type UserSmallCardFragment = { __typename?: 'User', id: string, gender: Gender, age: number, livingPref: string, topPhotoUrl?: string | null };

export type UserTopCardFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type MeForMeFragment = { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type MatchMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type MatchMutation = { __typename?: 'Mutation', like: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> } };

export type SkipMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type SkipMutation = { __typename?: 'Mutation', skip: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> } };

export type UserForLikePageFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type ReceiveLikeUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type ReceiveLikeUsersQuery = { __typename?: 'Query', receiveLikeUsers: Array<{ __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> }> };

export type MessageItemFragment = { __typename?: 'Message', id: string, mine: boolean, content: string, createdAt: string, user: { __typename?: 'User', id: string, topPhotoUrl?: string | null } };

export type NewMessageRoomItemFragment = { __typename?: 'MessageRoom', id: string, partner: { __typename?: 'User', id: string, nickName: string, photoUrls: Array<string> } };

export type MessageRoomItemFragment = { __typename?: 'MessageRoom', id: string, partner: { __typename?: 'User', id: string, nickName: string, photoUrls: Array<string> }, lastMessage: { __typename?: 'Message', id: string, content: string, createdAt: string } };

export type NewMessageRoomsQueryVariables = Exact<{
  input: PageInput;
}>;


export type NewMessageRoomsQuery = { __typename?: 'Query', newMessageRooms: { __typename?: 'MessageRoomConnection', edges: Array<{ __typename?: 'MessageRoomEdge', cursor: string, node: { __typename?: 'MessageRoom', id: string, partner: { __typename?: 'User', id: string, nickName: string, photoUrls: Array<string> } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage?: boolean | null } } };

export type MessageRoomsQueryVariables = Exact<{
  input: PageInput;
}>;


export type MessageRoomsQuery = { __typename?: 'Query', messageRooms: { __typename?: 'MessageRoomConnection', edges: Array<{ __typename?: 'MessageRoomEdge', cursor: string, node: { __typename?: 'MessageRoom', id: string, partner: { __typename?: 'User', id: string, nickName: string, photoUrls: Array<string> }, lastMessage: { __typename?: 'Message', id: string, content: string, createdAt: string } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage?: boolean | null } } };

export type UnlikeMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UnlikeMutation = { __typename?: 'Mutation', unlike: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, topPhotoUrl?: string | null } };

export type SendLikeUserItemFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, topPhotoUrl?: string | null };

export type SendLikeUsersQueryVariables = Exact<{
  input: PageInput;
}>;


export type SendLikeUsersQuery = { __typename?: 'Query', sendLikeUsers: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, topPhotoUrl?: string | null } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage?: boolean | null } } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type LikeMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type LikeMutation = { __typename?: 'Mutation', like: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> } };

export type UserForUserPageFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type UsersQueryVariables = Exact<{
  input: PageInput;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', id: string, gender: Gender, age: number, livingPref: string, topPhotoUrl?: string | null, nickName: string, photoUrls: Array<string> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage?: boolean | null } } };

export const UserSmallCardFragmentDoc = gql`
    fragment UserSmallCard on User {
  id
  gender
  age
  livingPref
  topPhotoUrl
}
    `;
export const MeForMeFragmentDoc = gql`
    fragment MeForMe on Me {
  id
  gender
  nickName
  age
  livingPref
  photoPaths
  photoUrls
}
    `;
export const UserTopCardFragmentDoc = gql`
    fragment UserTopCard on User {
  id
  gender
  nickName
  age
  livingPref
  photoUrls
}
    `;
export const UserForLikePageFragmentDoc = gql`
    fragment UserForLikePage on User {
  id
  ...UserTopCard
}
    ${UserTopCardFragmentDoc}`;
export const MessageItemFragmentDoc = gql`
    fragment MessageItem on Message {
  id
  user {
    id
    topPhotoUrl
  }
  mine
  content
  createdAt
}
    `;
export const NewMessageRoomItemFragmentDoc = gql`
    fragment NewMessageRoomItem on MessageRoom {
  id
  partner {
    id
    nickName
    photoUrls
  }
}
    `;
export const MessageRoomItemFragmentDoc = gql`
    fragment MessageRoomItem on MessageRoom {
  id
  partner {
    id
    nickName
    photoUrls
  }
  lastMessage {
    id
    content
    createdAt
  }
}
    `;
export const UserActionCardFragmentDoc = gql`
    fragment UserActionCard on User {
  id
  gender
  nickName
  age
  livingPref
  topPhotoUrl
}
    `;
export const SendLikeUserItemFragmentDoc = gql`
    fragment SendLikeUserItem on User {
  id
  ...UserActionCard
}
    ${UserActionCardFragmentDoc}`;
export const UserForUserPageFragmentDoc = gql`
    fragment UserForUserPage on User {
  id
  ...UserTopCard
}
    ${UserTopCardFragmentDoc}`;
export const AccessDocument = gql`
    mutation Access {
  access {
    id
    ...MeForMe
  }
}
    ${MeForMeFragmentDoc}`;
export type AccessMutationFn = Apollo.MutationFunction<AccessMutation, AccessMutationVariables>;

/**
 * __useAccessMutation__
 *
 * To run a mutation, you first call `useAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [accessMutation, { data, loading, error }] = useAccessMutation({
 *   variables: {
 *   },
 * });
 */
export function useAccessMutation(baseOptions?: Apollo.MutationHookOptions<AccessMutation, AccessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AccessMutation, AccessMutationVariables>(AccessDocument, options);
      }
export type AccessMutationHookResult = ReturnType<typeof useAccessMutation>;
export type AccessMutationResult = Apollo.MutationResult<AccessMutation>;
export type AccessMutationOptions = Apollo.BaseMutationOptions<AccessMutation, AccessMutationVariables>;
export const MeDocument = gql`
    query me {
  me {
    id
    ...MeForMe
  }
}
    ${MeForMeFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const MatchDocument = gql`
    mutation Match($userId: ID!) {
  like(userId: $userId) {
    id
    ...UserForLikePage
  }
}
    ${UserForLikePageFragmentDoc}`;
export type MatchMutationFn = Apollo.MutationFunction<MatchMutation, MatchMutationVariables>;

/**
 * __useMatchMutation__
 *
 * To run a mutation, you first call `useMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [matchMutation, { data, loading, error }] = useMatchMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useMatchMutation(baseOptions?: Apollo.MutationHookOptions<MatchMutation, MatchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MatchMutation, MatchMutationVariables>(MatchDocument, options);
      }
export type MatchMutationHookResult = ReturnType<typeof useMatchMutation>;
export type MatchMutationResult = Apollo.MutationResult<MatchMutation>;
export type MatchMutationOptions = Apollo.BaseMutationOptions<MatchMutation, MatchMutationVariables>;
export const SkipDocument = gql`
    mutation Skip($userId: ID!) {
  skip(userId: $userId) {
    id
    ...UserForLikePage
  }
}
    ${UserForLikePageFragmentDoc}`;
export type SkipMutationFn = Apollo.MutationFunction<SkipMutation, SkipMutationVariables>;

/**
 * __useSkipMutation__
 *
 * To run a mutation, you first call `useSkipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSkipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [skipMutation, { data, loading, error }] = useSkipMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useSkipMutation(baseOptions?: Apollo.MutationHookOptions<SkipMutation, SkipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SkipMutation, SkipMutationVariables>(SkipDocument, options);
      }
export type SkipMutationHookResult = ReturnType<typeof useSkipMutation>;
export type SkipMutationResult = Apollo.MutationResult<SkipMutation>;
export type SkipMutationOptions = Apollo.BaseMutationOptions<SkipMutation, SkipMutationVariables>;
export const ReceiveLikeUsersDocument = gql`
    query ReceiveLikeUsers {
  receiveLikeUsers {
    id
    ...UserForLikePage
  }
}
    ${UserForLikePageFragmentDoc}`;

/**
 * __useReceiveLikeUsersQuery__
 *
 * To run a query within a React component, call `useReceiveLikeUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useReceiveLikeUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReceiveLikeUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useReceiveLikeUsersQuery(baseOptions?: Apollo.QueryHookOptions<ReceiveLikeUsersQuery, ReceiveLikeUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReceiveLikeUsersQuery, ReceiveLikeUsersQueryVariables>(ReceiveLikeUsersDocument, options);
      }
export function useReceiveLikeUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReceiveLikeUsersQuery, ReceiveLikeUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReceiveLikeUsersQuery, ReceiveLikeUsersQueryVariables>(ReceiveLikeUsersDocument, options);
        }
export type ReceiveLikeUsersQueryHookResult = ReturnType<typeof useReceiveLikeUsersQuery>;
export type ReceiveLikeUsersLazyQueryHookResult = ReturnType<typeof useReceiveLikeUsersLazyQuery>;
export type ReceiveLikeUsersQueryResult = Apollo.QueryResult<ReceiveLikeUsersQuery, ReceiveLikeUsersQueryVariables>;
export const NewMessageRoomsDocument = gql`
    query NewMessageRooms($input: PageInput!) {
  newMessageRooms(input: $input) {
    edges {
      node {
        id
        ...NewMessageRoomItem
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    ${NewMessageRoomItemFragmentDoc}`;

/**
 * __useNewMessageRoomsQuery__
 *
 * To run a query within a React component, call `useNewMessageRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageRoomsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useNewMessageRoomsQuery(baseOptions: Apollo.QueryHookOptions<NewMessageRoomsQuery, NewMessageRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NewMessageRoomsQuery, NewMessageRoomsQueryVariables>(NewMessageRoomsDocument, options);
      }
export function useNewMessageRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NewMessageRoomsQuery, NewMessageRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NewMessageRoomsQuery, NewMessageRoomsQueryVariables>(NewMessageRoomsDocument, options);
        }
export type NewMessageRoomsQueryHookResult = ReturnType<typeof useNewMessageRoomsQuery>;
export type NewMessageRoomsLazyQueryHookResult = ReturnType<typeof useNewMessageRoomsLazyQuery>;
export type NewMessageRoomsQueryResult = Apollo.QueryResult<NewMessageRoomsQuery, NewMessageRoomsQueryVariables>;
export const MessageRoomsDocument = gql`
    query MessageRooms($input: PageInput!) {
  messageRooms(input: $input) {
    edges {
      node {
        id
        ...MessageRoomItem
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    ${MessageRoomItemFragmentDoc}`;

/**
 * __useMessageRoomsQuery__
 *
 * To run a query within a React component, call `useMessageRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessageRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageRoomsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useMessageRoomsQuery(baseOptions: Apollo.QueryHookOptions<MessageRoomsQuery, MessageRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessageRoomsQuery, MessageRoomsQueryVariables>(MessageRoomsDocument, options);
      }
export function useMessageRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessageRoomsQuery, MessageRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessageRoomsQuery, MessageRoomsQueryVariables>(MessageRoomsDocument, options);
        }
export type MessageRoomsQueryHookResult = ReturnType<typeof useMessageRoomsQuery>;
export type MessageRoomsLazyQueryHookResult = ReturnType<typeof useMessageRoomsLazyQuery>;
export type MessageRoomsQueryResult = Apollo.QueryResult<MessageRoomsQuery, MessageRoomsQueryVariables>;
export const UnlikeDocument = gql`
    mutation Unlike($userId: ID!) {
  unlike(userId: $userId) {
    id
    ...SendLikeUserItem
  }
}
    ${SendLikeUserItemFragmentDoc}`;
export type UnlikeMutationFn = Apollo.MutationFunction<UnlikeMutation, UnlikeMutationVariables>;

/**
 * __useUnlikeMutation__
 *
 * To run a mutation, you first call `useUnlikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlikeMutation, { data, loading, error }] = useUnlikeMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnlikeMutation(baseOptions?: Apollo.MutationHookOptions<UnlikeMutation, UnlikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlikeMutation, UnlikeMutationVariables>(UnlikeDocument, options);
      }
export type UnlikeMutationHookResult = ReturnType<typeof useUnlikeMutation>;
export type UnlikeMutationResult = Apollo.MutationResult<UnlikeMutation>;
export type UnlikeMutationOptions = Apollo.BaseMutationOptions<UnlikeMutation, UnlikeMutationVariables>;
export const SendLikeUsersDocument = gql`
    query SendLikeUsers($input: PageInput!) {
  sendLikeUsers(input: $input) {
    edges {
      node {
        id
        ...SendLikeUserItem
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    ${SendLikeUserItemFragmentDoc}`;

/**
 * __useSendLikeUsersQuery__
 *
 * To run a query within a React component, call `useSendLikeUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSendLikeUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSendLikeUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendLikeUsersQuery(baseOptions: Apollo.QueryHookOptions<SendLikeUsersQuery, SendLikeUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SendLikeUsersQuery, SendLikeUsersQueryVariables>(SendLikeUsersDocument, options);
      }
export function useSendLikeUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SendLikeUsersQuery, SendLikeUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SendLikeUsersQuery, SendLikeUsersQueryVariables>(SendLikeUsersDocument, options);
        }
export type SendLikeUsersQueryHookResult = ReturnType<typeof useSendLikeUsersQuery>;
export type SendLikeUsersLazyQueryHookResult = ReturnType<typeof useSendLikeUsersLazyQuery>;
export type SendLikeUsersQueryResult = Apollo.QueryResult<SendLikeUsersQuery, SendLikeUsersQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    ...MeForMe
  }
}
    ${MeForMeFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    id
    ...MeForMe
  }
}
    ${MeForMeFragmentDoc}`;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const LikeDocument = gql`
    mutation Like($userId: ID!) {
  like(userId: $userId) {
    id
    ...UserForUserPage
  }
}
    ${UserForUserPageFragmentDoc}`;
export type LikeMutationFn = Apollo.MutationFunction<LikeMutation, LikeMutationVariables>;

/**
 * __useLikeMutation__
 *
 * To run a mutation, you first call `useLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeMutation, { data, loading, error }] = useLikeMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useLikeMutation(baseOptions?: Apollo.MutationHookOptions<LikeMutation, LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeMutation, LikeMutationVariables>(LikeDocument, options);
      }
export type LikeMutationHookResult = ReturnType<typeof useLikeMutation>;
export type LikeMutationResult = Apollo.MutationResult<LikeMutation>;
export type LikeMutationOptions = Apollo.BaseMutationOptions<LikeMutation, LikeMutationVariables>;
export const UsersDocument = gql`
    query Users($input: PageInput!) {
  users(input: $input) {
    edges {
      node {
        id
        ...UserSmallCard
        ...UserForUserPage
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    ${UserSmallCardFragmentDoc}
${UserForUserPageFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUsersQuery(baseOptions: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;