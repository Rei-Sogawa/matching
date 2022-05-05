import { FireDocument } from "@rei-sogawa/unfireorm";
import { merge, omit } from "lodash";

import { LikeData } from "./like";

export type LikeIndexShardData = {
  shard: {
    [id in string]: LikeData;
  };
};

export class LikeIndexShardDoc extends FireDocument<LikeIndexShardData> {
  shard!: {
    [id in string]: LikeData;
  };

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data] as const;
  }

  addIndex(id: string, data: LikeData) {
    return this.edit({ shard: merge(this.shard, { [id]: data }) });
  }

  editIndex(id: string, data: LikeData) {
    return this.edit({ shard: merge(this.shard, { [id]: data }) });
  }

  removeIndex(id: string) {
    return this.edit({ shard: omit(this.shard, [id]) });
  }
}
