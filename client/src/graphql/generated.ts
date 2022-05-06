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

export type Mutation = {
  __typename?: 'Mutation';
  access: Me;
  like: User;
  signUp: Me;
  unlike: User;
  updateUser: Me;
};


export type MutationLikeArgs = {
  userId: Scalars['ID'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUnlikeArgs = {
  userId: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  me: Me;
  receiveLikeUsers: Array<User>;
  sendLikeUsers: Array<User>;
  user: User;
  users: UserConnection;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  input: UsersInput;
};

export type SignUpInput = {
  email: Scalars['String'];
  password: Scalars['String'];
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
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: UsersPageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['DateTime'];
  node: User;
};

export type UsersInput = {
  after?: InputMaybe<Scalars['DateTime']>;
  first: Scalars['Int'];
};

export type UsersPageInfo = {
  __typename?: 'UsersPageInfo';
  endCursor?: Maybe<Scalars['DateTime']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
};

export type AccessMutationVariables = Exact<{ [key: string]: never; }>;


export type AccessMutation = { __typename?: 'Mutation', access: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type UserSummaryItemFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type UserTopCardFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type MeForMeFragment = { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type UnlikeMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UnlikeMutation = { __typename?: 'Mutation', unlike: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> } };

export type SendLikeUserItemFragment = { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type SendLikeUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type SendLikeUsersQuery = { __typename?: 'Query', sendLikeUsers: Array<{ __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> }> };

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

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoUrls: Array<string> } };

export type UserForUsersPageUserCardFragment = { __typename?: 'User', id: string, gender: Gender, age: number, livingPref: string, photoUrls: Array<string> };

export type UsersQueryVariables = Exact<{
  input: UsersInput;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', cursor: string, node: { __typename?: 'User', id: string, gender: Gender, age: number, livingPref: string, photoUrls: Array<string> } }>, pageInfo: { __typename?: 'UsersPageInfo', endCursor?: string | null, hasNextPage?: boolean | null } } };

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
export const UserSummaryItemFragmentDoc = gql`
    fragment UserSummaryItem on User {
  id
  gender
  nickName
  age
  livingPref
  photoUrls
}
    `;
export const SendLikeUserItemFragmentDoc = gql`
    fragment SendLikeUserItem on User {
  id
  ...UserSummaryItem
}
    ${UserSummaryItemFragmentDoc}`;
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
export const UserForUserPageFragmentDoc = gql`
    fragment UserForUserPage on User {
  id
  ...UserTopCard
}
    ${UserTopCardFragmentDoc}`;
export const UserForUsersPageUserCardFragmentDoc = gql`
    fragment UserForUsersPageUserCard on User {
  id
  gender
  age
  livingPref
  photoUrls
}
    `;
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
    query SendLikeUsers {
  sendLikeUsers {
    id
    ...SendLikeUserItem
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
 *   },
 * });
 */
export function useSendLikeUsersQuery(baseOptions?: Apollo.QueryHookOptions<SendLikeUsersQuery, SendLikeUsersQueryVariables>) {
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
export const UserDocument = gql`
    query User($id: ID!) {
  user(id: $id) {
    id
    ...UserTopCard
  }
}
    ${UserTopCardFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query Users($input: UsersInput!) {
  users(input: $input) {
    edges {
      node {
        id
        ...UserForUsersPageUserCard
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    ${UserForUsersPageUserCardFragmentDoc}`;

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