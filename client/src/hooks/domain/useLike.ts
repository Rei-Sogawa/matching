import { gql } from "@apollo/client";

import {
  SignUpInput,
  useCancelLikeMutation,
  useCreateLikeMutation,
  useMatchLikeMutation,
  useReceiveLikeUsersQuery,
  useSignUpMutation,
  useSkipLikeMutation,
  useUsersQuery,
} from "../../graphql/generated";

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
  mutation MatchLike($userId: ID!) {
    matchLike(userId: $userId) {
      id
      ...UserForLikePage
    }
  }
`;

export const useMatchLike = (userId: string) => {
  const [mutate] = useMatchLikeMutation({ variables: { userId } });

  const matchLike = async () => {
    await mutate();
  };

  return { matchLike };
};

gql`
  mutation SkipLike($userId: ID!) {
    skipLike(userId: $userId) {
      id
      ...UserForLikePage
    }
  }
`;

export const useSkipLike = (userId: string) => {
  const [mutate] = useSkipLikeMutation({ variables: { userId } });

  const skipLike = async () => {
    await mutate();
  };

  return { skipLike };
};

gql`
  mutation CancelLike($userId: ID!) {
    cancelLike(userId: $userId) {
      id
      ...UserForUserPage
    }
  }
`;

export const useCancelLike = (userId: string) => {
  const [mutate] = useCancelLikeMutation({ variables: { userId } });

  const cancelLike = async () => {
    await mutate();
  };

  return { cancelLike };
};

gql`
  mutation CreateLike($userId: ID!) {
    createLike(userId: $userId) {
      id
      ...SendLikeUserItem
    }
  }
`;

export const useCreateLike = (userId: string) => {
  const [mutate] = useCreateLikeMutation({ variables: { userId } });

  const createLike = async () => {
    await mutate();
  };

  return { createLike };
};

gql`
  query Users($input: PageInput!) {
    viewer {
      id
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
