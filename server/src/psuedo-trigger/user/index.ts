import { UserDoc } from "../../fire/docs/user";
import { UserIndexCollection } from "../../fire/index/user-index";

export const onCreateUser = async (user: UserDoc, collections: { userIndexCollection: UserIndexCollection }) => {
  await collections.userIndexCollection.add(user.indexData);
};

export const onUpdateUser = async (user: UserDoc, collections: { userIndexCollection: UserIndexCollection }) => {
  await collections.userIndexCollection.update(user.indexData);
};
