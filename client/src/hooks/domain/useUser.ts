import { gql } from "@apollo/client";

import { UpdateUserProfileInput, useSendLikeUsersQuery, useUpdateUserProfileMutation } from "../../graphql/generated";

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

gql`
  query SendLikeUsers($input: PageInput!) {
    viewer {
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
