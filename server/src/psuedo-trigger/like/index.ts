import { LikeDoc } from "../../fire/docs/like";
import { UserLikeIndexCollection } from "../../fire/index/user-like-index";

export const onCreateLike = async (
  like: LikeDoc,
  collections: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await collections.userLikeIndexCollection.of(like.senderId).add(like.indexData);
  await collections.userLikeIndexCollection.of(like.receiverId).add(like.indexData);
};

export const onUpdateLike = async (
  like: LikeDoc,
  collections: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await collections.userLikeIndexCollection.of(like.senderId).update(like.indexData);
  await collections.userLikeIndexCollection.of(like.receiverId).update(like);
};

export const onDeleteLike = async (
  like: LikeDoc,
  collections: { userLikeIndexCollection: UserLikeIndexCollection }
) => {
  await collections.userLikeIndexCollection.of(like.senderId).delete(like.indexData);
  await collections.userLikeIndexCollection.of(like.receiverId).delete(like.indexData);
};
