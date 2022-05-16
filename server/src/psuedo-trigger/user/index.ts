import { UserDoc } from "../../fire/docs/user";
import { UserIndexCollection } from "../../fire/index/user-index";

export const onCreateUser = async (
  { user }: { user: UserDoc },
  { userIndexCollection }: { userIndexCollection: UserIndexCollection }
) => {
  await userIndexCollection.store(user.indexData);
};

export const onUpdateUser = async (
  { user }: { user: UserDoc },
  { userIndexCollection }: { userIndexCollection: UserIndexCollection }
) => {
  await userIndexCollection.store(user.indexData);
};
