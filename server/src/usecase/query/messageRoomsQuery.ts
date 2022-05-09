import { last } from "lodash";

import { authorize } from "../../authorize";
import { Context } from "../../context";
import { PageInput } from "../../graphql/generated";

export const messageRoomsQuery = async (_: unknown, args: { input: PageInput }, context: Context) => {
  authorize(context);

  const { input } = args;
  const { uid } = context.auth;
  const { messageRoomsCollection } = context.collections;

  const messageRooms = await messageRoomsCollection.paginatedMessageRooms({
    first: input.first,
    after: input.after,
    userId: uid,
  });

  const edges = messageRooms.map((mr) => ({ node: mr, cursor: mr.createdAt }));

  return {
    edges,
    pageInfo: {
      endCursor: last(edges)?.cursor,
      hasNextPage: input.first === edges.length,
    },
  };
};
