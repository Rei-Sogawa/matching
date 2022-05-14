import { last } from "lodash";

import { Context } from "../../../context";
import { ViewerMessageRoomsArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const messageRoomsQuery = async (
  { uid }: ViewerType,
  { input }: ViewerMessageRoomsArgs,
  { collections: { messageRoomsCollection } }: Context
) => {
  const messageRooms = await messageRoomsCollection.paginatedMessageRooms({
    first: input.first,
    after: input.after,
    userId: uid,
  });

  const edges = messageRooms.map((mr) => ({ node: mr, cursor: mr.createdAt }));

  return {
    edges,
    pageInfo: {
      hasNextPage: input.first === edges.length,
      endCursor: last(edges)?.cursor,
    },
  };
};
