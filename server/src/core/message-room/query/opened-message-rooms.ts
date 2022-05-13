import { last } from "lodash";

import { Context } from "../../../context";
import { QueryOpenedMessageRoomsArgs } from "../../../graphql/generated";
import { ViewerType } from "../../../resolvers/query";

export const openedMessageRooms = async (
  { uid }: ViewerType,
  { input }: QueryOpenedMessageRoomsArgs,
  { collections: { messageRoomsCollection } }: Context
) => {
  const messageRooms = await messageRoomsCollection.paginatedOpenedMessageRooms({
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
