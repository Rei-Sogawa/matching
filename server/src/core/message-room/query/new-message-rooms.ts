import { last } from "lodash";

import { Context } from "../../../context";
import { ViewerNewMessageRoomsArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const newMessageRoomsQuery = async (
  { uid }: ViewerType,
  { input }: ViewerNewMessageRoomsArgs,
  { collections: { messageRoomsCollection } }: Context
) => {
  const messageRooms = await messageRoomsCollection.paginatedNewMessageRooms({
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
