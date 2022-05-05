import { FireCollection } from "@rei-sogawa/unfireorm";
import { PaginateInput, paginateQuery } from "@rei-sogawa/unfireorm/dist/helper";
import { CollectionReference } from "firebase-admin/firestore";

import { userConverter, UserData, UserDoc } from "../docs/user";

export class UsersCollection extends FireCollection<UserData, UserDoc> {
  constructor(ref: CollectionReference) {
    super(ref, (snap) => new UserDoc(snap), userConverter);
  }

  findAll(paginateInput: PaginateInput<Date>) {
    return paginateQuery<UserData, Date, UserDoc, UsersCollection>(this, paginateInput, {
      forward: this.ref.orderBy("lastAccessedAt", "desc"),
      backward: this.ref.orderBy("lastAccessedAt", "asc"),
      cursorField: "lastAccessedAt",
    });
  }
}
