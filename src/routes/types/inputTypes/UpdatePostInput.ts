import { GraphQLInputObjectType, GraphQLString } from "graphql";

export const UpdatePostInput = new GraphQLInputObjectType({
  name: "UpdatePostInput",
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
