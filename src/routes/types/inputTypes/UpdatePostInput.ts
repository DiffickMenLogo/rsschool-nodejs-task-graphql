import { GraphQLID, GraphQLInputObjectType, GraphQLString } from "graphql";

export const UpdatePostInput = new GraphQLInputObjectType({
  name: "UpdatePostInput",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
