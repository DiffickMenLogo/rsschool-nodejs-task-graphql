import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const GraphQLProfile = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: { type: GraphQLID },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLID },
    userId: { type: GraphQLID },
  }),
});
