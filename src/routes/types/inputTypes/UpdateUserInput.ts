import { GraphQLID, GraphQLInputObjectType, GraphQLString } from "graphql";

export const UpdateUserInput = new GraphQLInputObjectType({
  name: "UpdateUserInput",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});
