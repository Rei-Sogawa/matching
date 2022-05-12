import { last } from "lodash";

import { authorize } from "../../../authorize";
import { Context } from "../../../context";
import { QueryNewMessageRoomsArgs } from "../../../graphql/generated";

export const newMessageRoomsQuery = async (
  _: unknown,
  { input }: QueryNewMessageRoomsArgs,
  { auth, collections: { messageRoomsCollection } }: Context
) => {
  authorize(auth);

  const messageRooms = await messageRoomsCollection.paginatedNewMessageRooms({
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
