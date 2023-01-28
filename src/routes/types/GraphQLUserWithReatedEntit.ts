import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { GraphQLMemberType, GraphQLPost, GraphQLProfile, GraphQLUser } from ".";
import { UserEntity } from "./../../utils/DB/entities/DBUsers";

const GraphQLUserWithReatedEntit = async (fastify: FastifyInstance) => {
  const GraphQLUserWithReatedEntitType = new GraphQLObjectType({
    name: "GraphQLUserWithReatedEntit",
    fields: () => ({
      user: {
        type: GraphQLUser,
        resolve: async (parent: UserEntity) => {
          return parent;
        },
      },
      profile: {
        type: GraphQLProfile,
        resolve: async (parent: UserEntity) => {
          const profile = await fastify.db.profiles.findOne({
            key: "id",
            equals: parent.id,
          });

          if (profile === null) {
            throw fastify.httpErrors.notFound("Profile not found");
          }

          return profile;
        },
      },
      posts: {
        type: new GraphQLList(GraphQLPost),
        resolve: async (parent: UserEntity) => {
          const posts = await fastify.db.posts.findMany({
            key: "userId",
            equals: parent.id,
          });

          return posts;
        },
      },
      memberType: {
        type: GraphQLMemberType,
        resolve: async (parent: UserEntity) => {
          const userProfile = await fastify.db.profiles.findOne({
            key: "id",
            equals: parent.id,
          });

          if (userProfile === null) {
            throw fastify.httpErrors.notFound("Profile not found");
          }

          const memberType = await fastify.db.memberTypes.findOne({
            key: "id",
            equals: userProfile.memberTypeId,
          });

          if (memberType === null) {
            throw fastify.httpErrors.notFound("MemberType not found");
          }

          return memberType;
        },
      },
    }),
  });

  return GraphQLUserWithReatedEntitType;
};

export { GraphQLUserWithReatedEntit };
