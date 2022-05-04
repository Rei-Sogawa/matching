import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";
import { CollectionReference } from "firebase-admin/firestore";
import { z } from "zod";

import { createConverter } from "../helpers/create-converter";

const UserStatSchema = z
  .object({
    sendLikeUserIds: z.array(z.string().min(1)),
    receiveLikeUserIds: z.array(z.string().min(1)),
    skipLikeUserIds: z.array(z.string().min(1)),
    matchUserIds: z.array(z.string().min(1)),
  })
  .strict();

export type UserStatData = z.infer<typeof UserStatSchema>;

export const userStatConverter = createConverter<UserStatData>();

export class UserStatDoc extends FireDocument<UserStatData> implements UserStatData {
  static create(collection: CollectionReference<UserStatData>, { id }: { id: string }) {
    const docRef = collection.doc(id);
    return new UserStatDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        sendLikeUserIds: [],
        receiveLikeUserIds: [],
        skipLikeUserIds: [],
        matchUserIds: [],
      }),
    });
  }

  sendLikeUserIds!: string[];
  receiveLikeUserIds!: string[];
  skipLikeUserIds!: string[];
  matchUserIds!: string[];

  constructor(snap: FireDocumentInput) {
    super(snap, userStatConverter);
  }

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  sendLike(userId: string) {
    return this.edit({ sendLikeUserIds: [...this.sendLikeUserIds, userId] });
  }

  receiveLike(userId: string) {
    return this.edit({ receiveLikeUserIds: [...this.receiveLikeUserIds, userId] });
  }

  match(userId: string) {
    return this.edit({ matchUserIds: [...this.matchUserIds, userId] });
  }
}
