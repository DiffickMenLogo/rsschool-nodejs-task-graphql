import { FastifyInstance } from "fastify";
import { GraphQLList, GraphQLObjectType } from "graphql";
import { UserEntity } from "../../utils/DB/entities/DBUsers";
import { GraphQLPost } from "./GraphQLPost";
import { GraphQLUser } from "./GraphQLUser";

export const GraphQLUserWithPosts = async (fastify: FastifyInstance) => {
  const GraphQLUserWithPostsType = new GraphQLObjectType({
    name: "GraphQLUserWithPosts",
    fields: () => ({
      user: {
        type: GraphQLUser,
        resolve: async (parent: UserEntity) => {
          return parent;
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
      subscribedToUser: {
        type: new GraphQLList(GraphQLUser),
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
    }),
  });

  return GraphQLUserWithPostsType;
};
