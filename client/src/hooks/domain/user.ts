import { gql } from "@apollo/client";

import {
  SignUpInput,
  UpdateUserProfileInput,
  useReceiveLikeUsersQuery,
  useSendLikeUsersQuery,
  useSignUpMutation,
  useSkipLikeUsersQuery,
  useUpdateUserLastAccessMutation,
  useUpdateUserProfileMutation,
  useUsersQuery,
} from "../../graphql/generated";

// QUERY
gql`
  query Users($input: PageInput!) {
    viewer {
      id
      users(input: $input) {
        edges {
          node {
            id
            ...UserSmallCard
            ...UserForSearchUserPage
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const useUsers = () => {
  const QUERY_SIZE = 6;

  const { data, fetchMore } = useUsersQuery({ variables: { input: { first: QUERY_SIZE } } });

  const onLoadMore = async () => {
    await fetchMore({ variables: { input: { first: QUERY_SIZE, after: data?.viewer.users.pageInfo.endCursor } } });
  };

  return { data, onLoadMore };
};

gql`
  query ReceiveLikeUsers {
    viewer {
      id
      receiveLikeUsers {
        id
        ...UserForLikePage
      }
    }
  }
`;

export const useReceiveLikeUsers = () => {
  const { data } = useReceiveLikeUsersQuery();

  return { data };
};

gql`
  query SendLikeUsers($input: PageInput!) {
    viewer {
      id
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
  }
`;

export const useSendLikeUsers = () => {
  const QUERY_SIZE = 6;

  const { data, fetchMore } = useSendLikeUsersQuery({ variables: { input: { first: QUERY_SIZE } } });

  const onLoadMore = async () => {
    await fetchMore({
      variables: { input: { first: QUERY_SIZE, after: data?.viewer.sendLikeUsers.pageInfo.endCursor } },
    });
  };

  return { data, onLoadMore };
};

gql`
  query SkipLikeUsers($input: PageInput!) {
    viewer {
      id
      skipLikeUsers(input: $input) {
        edges {
          node {
            id
            ...SkipLikeUserItem
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

export const useSkipLikeUsers = () => {
  const QUERY_SIZE = 6;

  const { data, fetchMore } = useSkipLikeUsersQuery({ variables: { input: { first: QUERY_SIZE } } });

  const onLoadMore = async () => {
    await fetchMore({
      variables: { input: { first: QUERY_SIZE, after: data?.viewer.skipLikeUsers.pageInfo.endCursor } },
    });
  };

  return { data, onLoadMore };
};

// MUTATION
gql`
  mutation UpdateUserLastAccess {
    updateUserLastAccess {
      id
    }
  }
`;

export const useUpdateUserLastAccess = () => {
  const [mutate] = useUpdateUserLastAccessMutation();

  const updateUserLastAccess = async () => {
    await mutate();
  };

  return { updateUserLastAccess };
};

gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      id
      ...MeProvider
    }
  }
`;

export const useSignUp = () => {
  const [mutate] = useSignUpMutation();

  const signUp = async (data: SignUpInput) => {
    await mutate({ variables: { input: data } });
  };

  return { signUp };
};

gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      ...MeProvider
    }
  }
`;

export const useUpdateUserProfile = () => {
  const [mutate] = useUpdateUserProfileMutation();

  const updateUserProfile = async (data: UpdateUserProfileInput) => {
    await mutate({ variables: { input: data } });
  };

  return { updateUserProfile };
};
