import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const GraphQLPost = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLID },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});
