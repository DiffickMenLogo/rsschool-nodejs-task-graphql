import { FastifyInstance } from "fastify";
import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  graphql,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import {
  GraphQLUser,
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  GraphQLUserWithReatedEntit,
  GraphQLUserWithProfile,
  GraphQLUserWithSubscrabed,
  GraphQLUserWithPosts,
} from "../types";
import { graphqlBodySchema } from "./schema";

let i = 1;

const prepareTestData = async (fastify: FastifyInstance) => {
  const testUser = await fastify.db.users.create({
    firstName: `User ${i}`,
    lastName: `LastName ${i}`,
    email: `user${i}@gmail.com`,
  });

  await fastify.db.profiles.create({
    userId: testUser.id,
    memberTypeId: "basic",
    avatar: "avatar",
    sex: "sometimes",
    birthday: 5345345345,
    country: "BY",
    street: "Street",
    city: "Minsk",
  });

  await fastify.db.posts.create({
    userId: testUser.id,
    title: `Title ${i}`,
    content: "Content",
  });
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
        await prepareTestData(fastify);
      }

      const GraphQLUserWithReatedEntitType = await GraphQLUserWithReatedEntit(
        fastify
      );
      const GraphQLUserWithProfileType = await GraphQLUserWithProfile(fastify);
      const GraphQLUserWithSubscrabedType = await GraphQLUserWithSubscrabed(
        fastify
      );
      const GraphQLUserWithPostsType = await GraphQLUserWithPosts(fastify);

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
            },
            getProfiles: {
              type: new GraphQLList(GraphQLProfile),
              resolve: async () => {
                const profiles = await fastify.db.profiles.findMany();
                return profiles;
              },
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
                id: { type: GraphQLID },
              },
              resolve: async (_: any, args: any) => {
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
                id: { type: GraphQLID },
              },
              resolve: async (_: any, args: any) => {
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
                id: { type: GraphQLID },
              },
              resolve: async (_: any, args: any) => {
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
                id: { type: GraphQLID },
              },
              resolve: async (_: any, args: any) => {
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
            getUsersWithRelatedEntities: {
              type: new GraphQLList(GraphQLUserWithReatedEntitType),
              resolve: async () => {
                const users = await fastify.db.users.findMany();
                return users;
              },
            },
            getUserWithRelatedEntities: {
              type: GraphQLUserWithReatedEntitType,
              args: {
                id: { type: GraphQLID },
              },
              resolve: async (_: any, args: any) => {
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
            getUsersWithProfile: {
              type: new GraphQLList(GraphQLUserWithProfileType),
              resolve: async () => {
                const users = await fastify.db.users.findMany();
                return users;
              },
            },
            getUserWithPosts: {
              type: GraphQLUserWithPostsType,
              args: {
                id: { type: GraphQLID },
              },
              resolve: async (_: any, args: any) => {
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
            getUsersWithSubscrabed: {
              type: new GraphQLList(GraphQLUserWithSubscrabedType),
              resolve: async () => {
                const users = await fastify.db.users.findMany();
                return users;
              },
            },
          }),
        }),
        mutation: new GraphQLObjectType({
          name: "Mutation",
          fields: () => ({
            createUser: {
              type: GraphQLUser,
              args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.create({
                  firstName: args.firstName,
                  lastName: args.lastName,
                  email: args.email,
                });

                return user;
              },
            },
            createProfile: {
              type: GraphQLProfile,
              args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
                avatar: { type: new GraphQLNonNull(GraphQLString) },
                sex: { type: new GraphQLNonNull(GraphQLString) },
                birthday: { type: new GraphQLNonNull(GraphQLString) },
                country: { type: new GraphQLNonNull(GraphQLString) },
                city: { type: new GraphQLNonNull(GraphQLString) },
                street: { type: new GraphQLNonNull(GraphQLString) },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.userId,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const memberType = await fastify.db.memberTypes.findOne({
                  key: "id",
                  equals: args.memberTypeId,
                });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound("MemberType not found");
                }

                const userAlreadyHasAProfile =
                  await fastify.db.profiles.findOne({
                    key: "userId",
                    equals: args.userId,
                  });

                if (userAlreadyHasAProfile !== null) {
                  throw fastify.httpErrors.conflict(
                    "User already has a profile"
                  );
                }

                const profile = await fastify.db.profiles.create({
                  userId: args.userId,
                  memberTypeId: args.memberTypeId,
                  avatar: args.avatar,
                  sex: args.sex,
                  birthday: args.birthday,
                  country: args.country,
                  city: args.city,
                  street: args.street,
                });

                return profile;
              },
            },
            createPost: {
              type: GraphQLPost,
              args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                content: { type: new GraphQLNonNull(GraphQLString) },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.userId,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const post = await fastify.db.posts.create({
                  userId: args.userId,
                  title: args.title,
                  content: args.content,
                });

                return post;
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
        i += 1;
        return result;
      } else {
        throw fastify.httpErrors.badRequest("Query not found");
      }
    }
  );
};

export default plugin;
