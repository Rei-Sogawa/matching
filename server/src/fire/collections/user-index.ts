import { CollectionReference, Timestamp } from "firebase-admin/firestore";
import { filter, orderBy, take } from "lodash";

import { UserIndexData } from "../docs/user";
import { FireIndex } from "../lib/fire-index";

export class UserIndexCollection extends FireIndex<UserIndexData> {
  docIds = ["0", "1", "2"];

  constructor(ref: CollectionReference) {
    super(ref);
  }

  async paginatedUsers({
    first,
    after,
    excludeUserIds,
  }: {
    first: number;
    after: Timestamp | null | undefined;
    excludeUserIds: string[];
  }) {
    return this.get()
      .then((ary) => filter(ary, (e) => !excludeUserIds.includes(e.id)))
      .then((ary) => orderBy(ary, (e) => e.lastAccessedAt, "desc"))
      .then((ary) => filter(ary, (e) => (after ? e.lastAccessedAt < after : true)))
      .then((ary) => take(ary, first));
  }
}
