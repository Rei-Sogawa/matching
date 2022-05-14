import { LikeDoc } from "../../fire/docs/like";
import { UserLikeIndexCollection } from "../../fire/index/user-like-index";

export const onCreateLike = async (
  { like }: { like: LikeDoc },
  { userLikeIndexCollection }: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await userLikeIndexCollection.of(like.senderId).add(like.indexData);
  await userLikeIndexCollection.of(like.receiverId).add(like.indexData);
};

export const onUpdateLike = async (
  { like }: { like: LikeDoc },
  { userLikeIndexCollection }: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await userLikeIndexCollection.of(like.senderId).update(like.indexData);
  await userLikeIndexCollection.of(like.receiverId).update(like.indexData);
};

export const onDeleteLike = async (
  { like }: { like: LikeDoc },
  { userLikeIndexCollection }: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await userLikeIndexCollection.of(like.senderId).delete(like.indexData);
  await userLikeIndexCollection.of(like.receiverId).delete(like.indexData);
};
