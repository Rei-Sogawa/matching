import { gql, Reference } from "@apollo/client";
import { Box, Button, Divider, Flex, Stack } from "@chakra-ui/react";
import { FC } from "react";

import { Loading } from "../../components/case/Loading";
import { BackButton } from "../../components/common/BackButton";
import { UserSummaryItem } from "../../components/domain/UserSummaryItem";
import { SendLikeUserItemFragment, useSendLikeUsersQuery, useUnlikeMutation } from "../../graphql/generated";
import { AppLayout } from "../../layouts/AppLayout";
import { routes } from "../../routes";

gql`
  mutation Unlike($userId: ID!) {
    unlike(userId: $userId) {
      id
      ...SendLikeUserItem
    }
  }
`;

const useUnlike = (userId: string) => {
  const [mutate] = useUnlikeMutation({
    variables: { userId },
    update(cache) {
      cache.modify({
        fields: {
          sendLikeUsers(existing, { readField }) {
            return existing.filter((u: Reference) => readField("id", u) !== userId);
          },
        },
      });
    },
  });

  const unlike = () => mutate();

  return { unlike };
};

gql`
  fragment SendLikeUserItem on User {
    id
    ...UserSummaryItem
  }
`;

type SendLikeUserItemProps = {
  user: SendLikeUserItemFragment;
};

const SendLikeUserItem: FC<SendLikeUserItemProps> = ({ user }) => {
  const { unlike } = useUnlike(user.id);

  const actionButton = <Button onClick={unlike}>いいねを取り消す</Button>;

  return <UserSummaryItem user={user} actionButton={actionButton} />;
};

gql`
  query SendLikeUsers {
    sendLikeUsers {
      id
      ...SendLikeUserItem
    }
  }
`;

type MyPageLikesPageTemplateProps = {
  users: SendLikeUserItemFragment[];
};

const MyPageLikesPageTemplate: FC<MyPageLikesPageTemplateProps> = ({ users }) => {
  return (
    <AppLayout footer={false}>
      <Stack spacing="6">
        <Flex w="full" position="relative" justifyContent="center" alignItems="center">
          <Box position="absolute" left="0">
            <BackButton path={routes["/my-page"].path()} />
          </Box>
          <Box alignSelf="center" fontWeight="bold" fontSize="2xl">
            あなたから
          </Box>
        </Flex>

        {users.map((u) => (
          <Stack key={u.id} alignSelf="center" spacing="6">
            <SendLikeUserItem user={u} />
            <Divider />
          </Stack>
        ))}
      </Stack>
    </AppLayout>
  );
};

export const MyPageLikesPage: FC = () => {
  const { data } = useSendLikeUsersQuery();

  return data ? <MyPageLikesPageTemplate users={data.sendLikeUsers} /> : <Loading />;
};
