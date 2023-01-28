import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  graphql,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import {
  GraphQLUser,
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
} from "../types";
import { graphqlBodySchema } from "./schema";

let i = 1;

const testData = async (fastify: any) => {
  const user = await fastify.db.users.create({
    id: `user-${i}`,
    firstName: `user-${i}-firstName`,
    lastName: `user-${i}-lastName`,
    email: `user-${i}-email`,
    subscribedToUserIds: [],
  });

  const memberType = await fastify.db.memberTypes.create({
    id: `memberType-${i}`,
    name: `memberType-${i}-name`,
  });

  const profile = await fastify.db.profiles.create({
    id: `profile-${i}`,
    userId: user.id,
    memberTypeId: memberType.id,
  });

  const post = await fastify.db.posts.create({
    id: `post-${i}`,
    userId: user.id,
    content: `post-${i}-content`,
  });

  i++;

  return {
    user,
    memberType,
    profile,
    post,
  };
};
const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      if (i <= 5) {
        await testData(fastify);
      }

      const shema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: "Query",
          fields: () => ({
            getUsers: {
              type: new GraphQLList(GraphQLUser),
              resolve: async () => {
                const users = await fastify.db.users.findMany();
                return users;
              },
              getProfiles: {
                type: new GraphQLList(GraphQLProfile),
                resolve: async () => {
                  const profiles = await fastify.db.profiles.findMany();
                  return profiles;
                },
                getPosts: {
                  type: new GraphQLList(GraphQLPost),
                  resolve: async () => {
                    const posts = await fastify.db.posts.findMany();
                    return posts;
                  },
                },
                getMemberTypes: {
                  type: new GraphQLList(GraphQLMemberType),
                  resolve: async () => {
                    const memberTypes = await fastify.db.memberTypes.findMany();
                    return memberTypes;
                  },
                },
                getUser: {
                  type: GraphQLUser,
                  args: {
                    id: { type: GraphQLString },
                  },
                  reslove: async (_: any, args: any) => {
                    const user = await fastify.db.users.findOne({
                      key: "id",
                      equals: args.id,
                    });

                    if (user === null) {
                      throw fastify.httpErrors.notFound("User not found");
                    }

                    return user;
                  },
                },
                getProfile: {
                  type: GraphQLProfile,
                  args: {
                    id: { type: GraphQLString },
                  },
                  reslove: async (_: any, args: any) => {
                    const profile = await fastify.db.profiles.findOne({
                      key: "id",
                      equals: args.id,
                    });

                    if (profile === null) {
                      throw fastify.httpErrors.notFound("Profile not found");
                    }

                    return profile;
                  },
                },
                getPost: {
                  type: GraphQLPost,
                  args: {
                    id: { type: GraphQLString },
                  },
                  reslove: async (_: any, args: any) => {
                    const post = await fastify.db.posts.findOne({
                      key: "id",
                      equals: args.id,
                    });

                    if (post === null) {
                      throw fastify.httpErrors.notFound("Post not found");
                    }

                    return post;
                  },
                },
                getMemberType: {
                  type: GraphQLMemberType,
                  args: {
                    id: { type: GraphQLString },
                  },
                  reslove: async (_: any, args: any) => {
                    const memberType = await fastify.db.memberTypes.findOne({
                      key: "id",
                      equals: args.id,
                    });

                    if (memberType === null) {
                      throw fastify.httpErrors.notFound("MemberType not found");
                    }

                    return memberType;
                  },
                },
              },
            },
          }),
        }),
      });

      if (typeof request.body.query !== "undefined") {
        const result = await graphql({
          schema: shema,
          source: request.body.query,
        });
        return result;
      } else {
        throw fastify.httpErrors.badRequest("Query not found");
      }
    }
  );
};

export default plugin;
