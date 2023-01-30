import { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } from "graphql";

export const CreateUserInput = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
