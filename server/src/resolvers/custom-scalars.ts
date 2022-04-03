import { GraphQLScalarType, Kind, ValueNode } from "graphql";

// NOTE: incoming (parseValue) : string -> Date
//       outgoing (serialize)  : Date -> string
export const DateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "A valid date time value.",
  parseValue(value) {
    if (typeof value !== "string") throw new Error("DateTime parseValue failed");
    return new Date(value);
  },
  parseLiteral(ast: ValueNode) {
    switch (ast.kind) {
      case Kind.STRING:
        return new Date(ast.value);
      default:
        return null;
    }
  },
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new Error("DateTime serialize failed");
  },
});
