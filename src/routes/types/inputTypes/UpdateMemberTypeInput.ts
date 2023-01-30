import { GraphQLInputObjectType, GraphQLInt } from "graphql";

export const UpdateMemberTypeInput = new GraphQLInputObjectType({
  name: "UpdateMemberTypeInput",
  fields: () => ({
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});
