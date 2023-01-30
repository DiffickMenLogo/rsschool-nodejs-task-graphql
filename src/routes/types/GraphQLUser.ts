import { UserEntity } from "./../../utils/DB/entities/DBUsers";
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLOutputType,
  GraphQLID,
} from "graphql";
import { GraphQLMemberType, GraphQLPost, GraphQLProfile } from ".";

export const GraphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      resolve: async (parent: UserEntity, args: [], context: any) =>
        context.userProfileDataLoader.load(parent.id),
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: async (parent: UserEntity, args: [], context: any) =>
        context.userPostsDataLoader.load(parent.id),
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (parent: UserEntity, args: [], context: any) => {
        const userProfile = await context.userProfileDataLoader.load(parent.id);

        if (userProfile === null) {
          return null;
        }

        return context.memberTypeLoader.load(userProfile.memberTypeId);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (parent: UserEntity, args: [], context: any) =>
        context.subscribedToUserDataLoader.loadMany(parent.subscribedToUserIds),
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (parent: UserEntity, args: [], context: any) =>
        context.userSubscribedToDataLoader.load(parent.id),
    },
  }),
});
