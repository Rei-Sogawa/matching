import { LikeDoc } from "../../fire/docs/like";
import { UserLikeIndexCollection } from "../../fire/index/user-like-index";

export const onCreateLike = async (
  like: LikeDoc,
  { userLikeIndexCollection }: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await userLikeIndexCollection.of(like.senderId).store(like.indexData);
  await userLikeIndexCollection.of(like.receiverId).store(like.indexData);
};

export const onUpdateLike = async (
  like: LikeDoc,
  { userLikeIndexCollection }: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await userLikeIndexCollection.of(like.senderId).store(like.indexData);
  await userLikeIndexCollection.of(like.receiverId).store(like.indexData);
};

export const onDeleteLike = async (
  like: LikeDoc,
  { userLikeIndexCollection }: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await userLikeIndexCollection.of(like.senderId).delete(like.indexData);
  await userLikeIndexCollection.of(like.receiverId).delete(like.indexData);
};
