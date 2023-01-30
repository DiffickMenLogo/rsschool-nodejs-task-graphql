import { GraphQLNonNull, GraphQLInputObjectType, GraphQLID } from "graphql";

export const SubscribeToUserInput = new GraphQLInputObjectType({
  name: "SubscribeToUserInput",
  fields: {
    currentUserId: { type: new GraphQLNonNull(GraphQLID) },
    subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
  },
});
