import { GraphQLNonNull, GraphQLInputObjectType, GraphQLID } from "graphql";

export const UnsubscribeFromUserInput = new GraphQLInputObjectType({
  name: "UnsubscribeFromUserInput",
  fields: {
    currentUserId: { type: new GraphQLNonNull(GraphQLID) },
    unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
  },
});
