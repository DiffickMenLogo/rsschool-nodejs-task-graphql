import { GraphQLInputObjectType, GraphQLInt, GraphQLString } from "graphql";

export const UpdateProfileInput = new GraphQLInputObjectType({
  name: "UpdateProfileInput",
  fields: () => ({
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    city: { type: GraphQLString },
    street: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
  }),
});
