import { FireDocument, FireDocumentInput } from "@rei-sogawa/unfireorm";

import { now } from "../../utils/now";
import { createConverter } from "../helpers/create-converter";

export type UserData = {
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};

export class UserDoc extends FireDocument<UserData> {
  constructor(snap: FireDocumentInput<UserData>) {
    super(snap, createConverter<UserData>());
  }

  static create({ displayName }: Pick<UserData, "displayName">) {
    const _now = now();
    return { displayName, createdAt: _now, updatedAt: _now };
  }
}
