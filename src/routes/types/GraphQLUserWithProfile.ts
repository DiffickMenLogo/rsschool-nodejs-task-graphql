import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { GraphQLProfile } from "./GraphQLProfile";
import { GraphQLUser } from "./GraphQLUser";

export const GraphQLUserWithProfile = async (fastify: FastifyInstance) => {
  const GraphQLUserWithProfileType = new GraphQLObjectType({
    name: "GraphQLUserWithProfile",
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
      userSubscribedTo: {
        type: new GraphQLList(GraphQLUser),
        resolve: async (parent: UserEntity) => {
          const userSubscribedTo = await fastify.db.users.findMany({
            key: "subscribedToUserIds",
            inArray: parent.id,
          });

          return userSubscribedTo;
        },
      },
    }),
  });

  return GraphQLUserWithProfileType;
};
