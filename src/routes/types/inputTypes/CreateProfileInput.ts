import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

export const CreateProfileInput = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLID) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
