import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  graphql,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import {
  GraphQLUser,
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
} from "../types";
import { graphqlBodySchema } from "./schema";

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
