import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

import { FireDocument } from "../lib/fire-document";

const MatchSchema = z.object({
  likeId: z.string().min(1),
  userIds: z.array(z.string().min(1)).length(2),
  createdAt: z.instanceof(Timestamp),
});

export type MatchData = z.infer<typeof MatchSchema>;

export type MatchIndexData = { id: string } & Pick<MatchData, "userIds" | "createdAt">;

export class MatchDoc extends FireDocument<MatchData> implements MatchData {
  static create(
    collection: CollectionReference<MatchData>,
    { likeId, userIds }: { likeId: string; userIds: string[] }
  ) {
    const docRef = collection.doc();
    const createdAt = Timestamp.now();
    return new MatchDoc({
      id: docRef.id,
      ref: docRef,
      data: () => ({
        likeId,
        userIds,
        createdAt,
        updatedAt: createdAt,
      }),
    });
  }

  likeId!: string;
  userIds!: string[];
  createdAt!: Timestamp;

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  toIndex() {
    const { id, ref, ...data } = this;
    const { userIds, createdAt } = data;
    const index: MatchIndexData = { id, userIds, createdAt };
    return index;
  }
}
