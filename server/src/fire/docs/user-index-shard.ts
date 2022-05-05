import { FireDocument } from "@rei-sogawa/unfireorm";
import { merge, omit } from "lodash";

import { UserData } from "./user";

export type UserIndexData = Pick<UserData, "gender" | "age" | "livingPref" | "lastAccessedAt">;

export type UserIndexShardData = {
  shard: {
    [id in string]: UserIndexData;
  };
};

export class UserIndexShardDoc extends FireDocument<UserIndexShardData> {
  shard!: {
    [id in string]: UserIndexData;
  };

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  addIndex(id: string, data: UserIndexData) {
    return this.edit({ shard: merge(this.shard, { [id]: data }) });
  }

  editIndex(id: string, data: UserIndexData) {
    return this.edit({ shard: merge(this.shard, { [id]: data }) });
  }

  removeIndex(id: string) {
    return this.edit({ shard: omit(this.shard, [id]) });
  }
}
