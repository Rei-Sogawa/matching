import { last } from "lodash";

import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { QueryOpenedMessageRoomsArgs } from "../../../graphql/generated";

export const openedMessageRooms = async (
  _: unknown,
  { input }: QueryOpenedMessageRoomsArgs,
  { auth, collections: { messageRoomsCollection } }: Context
) => {
  authorize(auth);

  const messageRooms = await messageRoomsCollection.paginatedOpenedMessageRooms({
    first: input.first,
    after: input.after,
    userId: auth.uid,
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
