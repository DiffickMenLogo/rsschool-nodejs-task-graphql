import { CreateUserInput } from "./../types/inputTypes/CreateUserInput";
import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import {
  ExecutionResult,
  graphql,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  parse,
  validate,
} from "graphql";
import {
  GraphQLUser,
  GraphQLMemberType,
  GraphQLPost,
  GraphQLProfile,
  CreateProfileInput,
  CreatePostInput,
  UpdateUserInput,
  UpdateProfileInput,
  UpdatePostInput,
  UpdateMemberTypeInput,
} from "../types";
import { graphqlBodySchema } from "./schema";
import depthLimit = require("graphql-depth-limit");

const DEPTH_LIMIT = 6;
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
      const { query } = request.body;

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
                id: { type: new GraphQLNonNull(GraphQLID) },
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
                id: { type: new GraphQLNonNull(GraphQLID) },
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
                id: { type: new GraphQLNonNull(GraphQLID) },
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
                id: { type: new GraphQLNonNull(GraphQLID) },
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
          }),
        }),
        mutation: new GraphQLObjectType({
          name: "Mutation",
          fields: () => ({
            createUser: {
              type: GraphQLUser,
              args: {
                varibales: {
                  type: new GraphQLNonNull(CreateUserInput),
                },
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
                varibles: {
                  type: new GraphQLNonNull(CreateProfileInput),
                },
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
                varibles: {
                  type: new GraphQLNonNull(CreatePostInput),
                },
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
            updateUser: {
              type: GraphQLUser,
              args: {
                varibles: {
                  type: new GraphQLNonNull(UpdateUserInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.id,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const updatedUser = await fastify.db.users.change(
                  args.id,
                  args
                );

                return updatedUser;
              },
            },
            updateProfile: {
              type: GraphQLProfile,
              args: {
                varibles: {
                  type: new GraphQLNonNull(UpdateProfileInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const profile = await fastify.db.profiles.findOne({
                  key: "id",
                  equals: args.id,
                });

                if (profile === null) {
                  throw fastify.httpErrors.notFound("Profile not found");
                }

                const memberType = await fastify.db.memberTypes.findOne({
                  key: "id",
                  equals: args.memberTypeId,
                });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound("MemberType not found");
                }

                const updatedProfile = await fastify.db.profiles.change(
                  args.id,
                  args
                );

                return updatedProfile;
              },
            },
            updatePost: {
              type: GraphQLPost,
              args: {
                varibles: {
                  type: new GraphQLNonNull(UpdatePostInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const post = await fastify.db.posts.findOne({
                  key: "id",
                  equals: args.id,
                });

                if (post === null) {
                  throw fastify.httpErrors.notFound("Post not found");
                }

                const updatedPost = await fastify.db.posts.change(
                  args.id,
                  args
                );

                return updatedPost;
              },
            },
            updateMemberType: {
              type: GraphQLMemberType,
              args: {
                varibles: {
                  type: new GraphQLNonNull(UpdateMemberTypeInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const memberType = await fastify.db.memberTypes.findOne({
                  key: "id",
                  equals: args.id,
                });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound("MemberType not found");
                }

                const updatedMemberType = await fastify.db.memberTypes.change(
                  args.id,
                  args
                );

                return updatedMemberType;
              },
            },
            subscribeToUser: {
              type: GraphQLUser,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                subscribeToUserId: { type: new GraphQLNonNull(GraphQLID) },
              },
              reslove: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.id,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }
                const subscribeToUser = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.subscribeToUserId,
                });

                if (subscribeToUser === null) {
                  throw fastify.httpErrors.notFound(
                    "User to subscribe to not found"
                  );
                }

                const userTriesToSubscribeToHimself =
                  args.id === args.subscribeToUserId;

                if (userTriesToSubscribeToHimself) {
                  throw fastify.httpErrors.badRequest(
                    "User can't subscribe to himself"
                  );
                }

                const userAlreadySubscribed =
                  subscribeToUser.subscribedToUserIds.includes(args.id);

                if (userAlreadySubscribed) {
                  throw fastify.httpErrors.badRequest(
                    "User already subscribed"
                  );
                }

                const patchedUser = await fastify.db.users.change(
                  args.subscribeToUserId,
                  {
                    subscribedToUserIds: [
                      ...subscribeToUser.subscribedToUserIds,
                      args.id,
                    ],
                  }
                );

                return patchedUser;
              },
            },
            unsubscribeFromUser: {
              type: GraphQLUser,
              args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                unsubscribeFromUserId: { type: new GraphQLNonNull(GraphQLID) },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.id,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const unsubscribeFromUser = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.unsubscribeFromUserId,
                });

                if (unsubscribeFromUser === null) {
                  throw fastify.httpErrors.notFound(
                    "User to unsubscribe from not found"
                  );
                }

                const userTriesToUnsubscribeFromHimself =
                  args.id === args.unsubscribeFromUserId;

                if (userTriesToUnsubscribeFromHimself) {
                  throw fastify.httpErrors.badRequest(
                    "User can't unsubscribe from himself"
                  );
                }

                try {
                  const subscribedUserIndex =
                    unsubscribeFromUser.subscribedToUserIds.indexOf(args.id);

                  unsubscribeFromUser.subscribedToUserIds.splice(
                    subscribedUserIndex,
                    1
                  );

                  const patchedUser = await fastify.db.users.change(
                    args.unsubscribeFromUserId,
                    {
                      subscribedToUserIds:
                        unsubscribeFromUser.subscribedToUserIds,
                    }
                  );

                  return patchedUser;
                } catch (error: any) {
                  throw fastify.httpErrors.badRequest(error);
                }
              },
            },
          }),
        }),
      });

      const errors = validate(shema, parse(query!), [depthLimit(DEPTH_LIMIT)]);

      if (errors.length > 0) {
        const result: ExecutionResult = {
          errors: errors,
          data: null,
        };

        return result;
      }

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
