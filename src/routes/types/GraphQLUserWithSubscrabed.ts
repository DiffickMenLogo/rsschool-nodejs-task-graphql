import { GraphQLUser } from "./GraphQLUser";
import { FastifyInstance } from "fastify";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { GraphQLList, GraphQLObjectType, GraphQLOutputType } from "graphql";

const config = GraphQLUser.toConfig();

export const GraphQLUserWithSubscrabed = async (fastify: FastifyInstance) => {
  const GraphQLUserWithSubscrabedType: GraphQLOutputType =
    new GraphQLObjectType({
      name: "GraphQLUserWithSubscrabed",
      fields: () => ({
        ...config.fields,
        subscribedToUser: {
          type: new GraphQLList(GraphQLUserWithSubscrabedType),
          resolve: async (parent: UserEntity) => {
            const { subscribedToUserIds } = parent;

            const subscribedToUser = await Promise.all(
              subscribedToUserIds.map(async (id: string) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: id,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                return user;
              })
            );

            return subscribedToUser;
          },
        },
        userSubscribedTo: {
          type: new GraphQLList(GraphQLUserWithSubscrabedType),
          resolve: async (parent: UserEntity) => {
            const { id } = parent;

            const userSubscribedTo = await fastify.db.users.findMany({
              key: "subscribedToUserIds",
              inArray: id,
            });

            return userSubscribedTo;
          },
        },
      }),
    });

  return GraphQLUserWithSubscrabedType;
};
