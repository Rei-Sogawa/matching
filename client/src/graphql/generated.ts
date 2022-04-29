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
  signUp: Me;
  updateUser: Me;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type Query = {
  __typename?: 'Query';
  me: Me;
  users: Array<User>;
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

export type UserForUserSwipeCardFragment = { __typename?: 'User', id: string, nickName: string, age: number, livingPref: string, photoUrls: Array<string> };

export type MeForMeFragment = { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type UsersForLikesQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersForLikesQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, nickName: string, age: number, livingPref: string, photoUrls: Array<string> }> };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'Me', id: string, gender: Gender, nickName: string, age: number, livingPref: string, photoPaths: Array<string>, photoUrls: Array<string> } };

export const UserForUserSwipeCardFragmentDoc = gql`
    fragment UserForUserSwipeCard on User {
  id
  nickName
  age
  livingPref
  photoUrls
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
export const UsersForLikesDocument = gql`
    query UsersForLikes {
  users {
    id
    ...UserForUserSwipeCard
  }
}
    ${UserForUserSwipeCardFragmentDoc}`;

/**
 * __useUsersForLikesQuery__
 *
 * To run a query within a React component, call `useUsersForLikesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersForLikesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersForLikesQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersForLikesQuery(baseOptions?: Apollo.QueryHookOptions<UsersForLikesQuery, UsersForLikesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersForLikesQuery, UsersForLikesQueryVariables>(UsersForLikesDocument, options);
      }
export function useUsersForLikesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersForLikesQuery, UsersForLikesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersForLikesQuery, UsersForLikesQueryVariables>(UsersForLikesDocument, options);
        }
export type UsersForLikesQueryHookResult = ReturnType<typeof useUsersForLikesQuery>;
export type UsersForLikesLazyQueryHookResult = ReturnType<typeof useUsersForLikesLazyQuery>;
export type UsersForLikesQueryResult = Apollo.QueryResult<UsersForLikesQuery, UsersForLikesQueryVariables>;
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