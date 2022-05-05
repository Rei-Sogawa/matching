import { FireDocument } from "@rei-sogawa/unfireorm";
import { merge, omit } from "lodash";

import { LikeData } from "./like";

export type LikeIndexData = {
  root: {
    [id in string]: LikeData;
  };
};

export class LikeIndexDoc extends FireDocument<LikeIndexData> {
  root!: {
    [id in string]: LikeData;
  };

  toData() {
    const { id, ref, ...data } = this;
    return data;
  }

  toBatch() {
    const { id, ref, ...data } = this;
    return [ref, data];
  }

  addIndex(id: string, data: LikeData) {
    return this.edit({ root: merge(this.root, { [id]: data }) });
  }

  editIndex(id: string, data: LikeData) {
    return this.edit({ root: merge(this.root, { [id]: data }) });
  }

  removeIndex(id: string) {
    return this.edit({ root: omit(this.root, [id]) });
  }
}
