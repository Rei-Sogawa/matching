/* eslint-disable */

// SEE: https://github.com/dotansimha/graphql-code-generator/issues/3899#issuecomment-616591648
const { printSchema } = require("graphql");
module.exports = {
  plugin: (schema, _documents, _config) => {
    return [
      'import { gql } from "apollo-server";',
      "",
      "export const typeDefs = gql`",
      printSchema(schema),
      "`;",
      "",
    ].join("\n");
  },
};
