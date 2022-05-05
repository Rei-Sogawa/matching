import { FireDocument } from "@rei-sogawa/unfireorm";

import { LikeData } from "./like";

export type LikeIndexData = {
  index: {
    [key in string]: LikeData;
  };
};

export class LikeIndexDoc extends FireDocument<LikeIndexData> {
  index!: LikeIndexData;

  toData() {
    const { index } = this;
    return index;
  }
}
