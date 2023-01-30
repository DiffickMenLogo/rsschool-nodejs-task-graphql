import { GraphQLID, GraphQLInt, GraphQLObjectType } from "graphql";

export const GraphQLMemberType = new GraphQLObjectType({
  name: "MemberType",
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});
