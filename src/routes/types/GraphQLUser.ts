import { FastifyInstance } from "fastify";
import { UserEntity } from "./../../utils/DB/entities/DBUsers";
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLOutputType,
} from "graphql";
import { GraphQLMemberType, GraphQLPost, GraphQLProfile } from ".";

export const GraphQLUser: GraphQLOutputType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
    profile: {
      type: GraphQLProfile,
      resolve: (parent: UserEntity, args: [], fastify: FastifyInstance) => {
        return fastify.db.profiles.findOne({
          key: "userId",
          equals: parent.id,
        });
      },
    },
    posts: {
      type: new GraphQLList(GraphQLPost),
      resolve: (parent: UserEntity, args: [], fastify: FastifyInstance) => {
        return fastify.db.posts.findMany({
          key: "userId",
          equals: parent.id,
        });
      },
    },
    memberType: {
      type: GraphQLMemberType,
      resolve: async (
        parent: UserEntity,
        args: [],
        fastify: FastifyInstance
      ) => {
        const userProfile = await fastify.db.profiles.findOne({
          key: "userId",
          equals: parent.id,
        });

        if (userProfile === null) {
          return null;
        }

        return fastify.db.memberTypes.findOne({
          key: "id",
          equals: userProfile.memberTypeId,
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (
        parent: UserEntity,
        args: [],
        fastify: FastifyInstance
      ) => {
        return Promise.all(
          parent.subscribedToUserIds.map((id) => {
            return fastify.db.users.findOne({
              key: "id",
              equals: id,
            });
          })
        );
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(GraphQLUser),
      resolve: async (
        parent: UserEntity,
        args: [],
        fastify: FastifyInstance
      ) => {
        return fastify.db.users.findMany({
          key: "subscribedToUserIds",
          inArray: parent.id,
        });
      },
    },
  }),
});
