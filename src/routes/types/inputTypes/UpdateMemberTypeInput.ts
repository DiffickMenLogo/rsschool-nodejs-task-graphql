import { GraphQLID, GraphQLInputObjectType, GraphQLInt } from "graphql";

export const UpdateMemberTypeInput = new GraphQLInputObjectType({
  name: "UpdateMemberTypeInput",
  fields: () => ({
    id: { type: GraphQLID },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});
