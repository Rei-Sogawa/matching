import { gql, Reference } from "@apollo/client";

import { useMe } from "../../contexts/Me";
import {
  useCancelLikeMutation,
  useCreateLikeMutation,
  useMatchLikeMutation,
  useMatchSkippedLikeMutation,
  useSkipLikeMutation,
} from "../../graphql/generated";
import { assertDefined } from "../../utils/assert-defined";

// MUTATION
gql`
  mutation MatchLike($userId: ID!) {
    matchLike(userId: $userId) {
      id
      ...UserForLikePage
    }
  }
`;

export const useMatchLike = (userId: string) => {
  const { me } = useMe();

  const [mutate] = useMatchLikeMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: "Viewer", id: me.id }),
        fields: {
          receiveLikeUsers(existing, { readField }) {
            return existing.filter((u: Reference) => readField("id", u) !== userId);
          },
        },
      });
    },
  });

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
  const { me } = useMe();

  const [mutate] = useSkipLikeMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: "Viewer", id: me.id }),
        fields: {
          receiveLikeUsers(existing, { readField }) {
            return existing.filter((u: Reference) => readField("id", u) !== userId);
          },
        },
      });
    },
  });

  const skipLike = async () => {
    await mutate();
  };

  return { skipLike };
};

gql`
  mutation CancelLike($userId: ID!) {
    cancelLike(userId: $userId) {
      id
    }
  }
`;

export const useCancelLike = (userId: string) => {
  const { me } = useMe();

  const [mutate] = useCancelLikeMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: "Viewer", id: me.id }),
        fields: {
          sendLikeUsers(existing, { readField }) {
            return {
              ...existing,
              edges: existing.edges.filter(({ node }: { node: Reference }) => readField("id", node) !== userId),
            };
          },
        },
      });
    },
  });

  const cancelLike = async () => {
    await mutate();
  };

  return { cancelLike };
};

gql`
  mutation MatchSkippedLike($userId: ID!) {
    matchSkippedLike(userId: $userId) {
      id
    }
  }
`;

export const useMatchSkippedLike = (userId: string) => {
  const { me } = useMe();

  const [mutate] = useMatchSkippedLikeMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        id: cache.identify({ __typename: "Viewer", id: me.id }),
        fields: {
          skipLikeUsers(existing, { readField }) {
            return {
              ...existing,
              edges: existing.edges.filter(({ node }: { node: Reference }) => readField("id", node) !== userId),
            };
          },
        },
      });
    },
  });

  const matchSkippedLike = async () => {
    await mutate();
  };

  return { matchSkippedLike };
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
  const { me } = useMe();

  const [mutate] = useCreateLikeMutation({
    variables: { userId },
    update(cache, { data }) {
      assertDefined(data);
      cache.modify({
        id: cache.identify({ __typename: "Viewer", id: me.id }),
        fields: {
          users(existing, { readField }) {
            return {
              ...existing,
              edges: existing.edges.filter(({ node }: { node: Reference }) => readField("id", node) !== userId),
            };
          },
        },
      });
    },
  });

  const createLike = async () => {
    await mutate();
  };

  return { createLike };
};
