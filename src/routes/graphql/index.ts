import { UnsubscribeFromUserInput } from "./../types/inputTypes/UnsubscribeFromUserInput";
import { CreateUserInput } from "./../types/inputTypes/CreateUserInput";
import {
  getMemberTypeLoader,
  getSubscribedToUserDataLoader,
  getUserPostsDataLoader,
  getUserProfileDataLoader,
  getUserSubscribedToDataLoader,
} from "../types/helpers/helpersToTypes";
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
import { SubscribeToUserInput } from "../types/inputTypes/SubscribeToUserInput";

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
      const { query, variables } = request.body;

      if (!query) {
        throw fastify.httpErrors.badRequest("Query is required");
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
                variables: {
                  type: new GraphQLNonNull(CreateUserInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.create({
                  firstName: args.variables.firstName,
                  lastName: args.variables.lastName,
                  email: args.variables.email,
                });

                return user;
              },
            },
            createProfile: {
              type: GraphQLProfile,
              args: {
                variables: {
                  type: new GraphQLNonNull(CreateProfileInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.userId,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const memberType = await fastify.db.memberTypes.findOne({
                  key: "id",
                  equals: args.variables.memberTypeId,
                });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound("MemberType not found");
                }

                const userAlreadyHasAProfile =
                  await fastify.db.profiles.findOne({
                    key: "userId",
                    equals: args.variables.userId,
                  });

                if (userAlreadyHasAProfile !== null) {
                  throw fastify.httpErrors.conflict(
                    "User already has a profile"
                  );
                }

                const profile = await fastify.db.profiles.create({
                  userId: args.variables.userId,
                  memberTypeId: args.variables.memberTypeId,
                  avatar: args.variables.avatar,
                  sex: args.variables.sex,
                  birthday: args.variables.birthday,
                  country: args.variables.country,
                  city: args.variables.city,
                  street: args.variables.street,
                });

                return profile;
              },
            },
            createPost: {
              type: GraphQLPost,
              args: {
                variables: {
                  type: new GraphQLNonNull(CreatePostInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.userId,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const post = await fastify.db.posts.create({
                  userId: args.variables.userId,
                  title: args.variables.title,
                  content: args.variables.content,
                });

                return post;
              },
            },
            updateUser: {
              type: GraphQLUser,
              args: {
                variables: {
                  type: new GraphQLNonNull(UpdateUserInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.id,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const updatedUser = await fastify.db.users.change(
                  args.variables.id,
                  args.variables
                );

                return updatedUser;
              },
            },
            updateProfile: {
              type: GraphQLProfile,
              args: {
                variables: {
                  type: new GraphQLNonNull(UpdateProfileInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const profile = await fastify.db.profiles.findOne({
                  key: "id",
                  equals: args.variables.id,
                });

                if (profile === null) {
                  throw fastify.httpErrors.notFound("Profile not found");
                }

                const memberType = await fastify.db.memberTypes.findOne({
                  key: "id",
                  equals: args.variables.memberTypeId,
                });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound("MemberType not found");
                }

                const updatedProfile = await fastify.db.profiles.change(
                  args.variables.id,
                  args.variables
                );

                return updatedProfile;
              },
            },
            updatePost: {
              type: GraphQLPost,
              args: {
                variables: {
                  type: new GraphQLNonNull(UpdatePostInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const post = await fastify.db.posts.findOne({
                  key: "id",
                  equals: args.variables.id,
                });

                if (post === null) {
                  throw fastify.httpErrors.notFound("Post not found");
                }

                const updatedPost = await fastify.db.posts.change(
                  args.variables.id,
                  args.variables
                );

                return updatedPost;
              },
            },
            updateMemberType: {
              type: GraphQLMemberType,
              args: {
                variables: {
                  type: new GraphQLNonNull(UpdateMemberTypeInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const memberType = await fastify.db.memberTypes.findOne({
                  key: "id",
                  equals: args.variables.id,
                });

                if (memberType === null) {
                  throw fastify.httpErrors.notFound("MemberType not found");
                }

                const updatedMemberType = await fastify.db.memberTypes.change(
                  args.variables.id,
                  args.variables
                );

                return updatedMemberType;
              },
            },
            subscribeToUser: {
              type: GraphQLUser,
              args: {
                variables: {
                  type: new GraphQLNonNull(SubscribeToUserInput),
                },
              },
              reslove: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.currentUserId,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }
                const subscribeToUser = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.subscribeToUserId,
                });

                if (subscribeToUser === null) {
                  throw fastify.httpErrors.notFound(
                    "User to subscribe to not found"
                  );
                }

                const userTriesToSubscribeToHimself =
                  args.variables.currentUserId ===
                  args.variables.subscribeToUserId;

                if (userTriesToSubscribeToHimself) {
                  throw fastify.httpErrors.badRequest(
                    "User can't subscribe to himself"
                  );
                }

                const userAlreadySubscribed =
                  subscribeToUser.subscribedToUserIds.includes(
                    args.variables.currentUserId
                  );

                if (userAlreadySubscribed) {
                  throw fastify.httpErrors.badRequest(
                    "User already subscribed"
                  );
                }

                const patchedUser = await fastify.db.users.change(
                  args.variables.subscribeToUserId,
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
                variables: {
                  type: new GraphQLNonNull(UnsubscribeFromUserInput),
                },
              },
              resolve: async (_: any, args: any) => {
                const user = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.currentUserId,
                });

                if (user === null) {
                  throw fastify.httpErrors.notFound("User not found");
                }

                const unsubscribeFromUser = await fastify.db.users.findOne({
                  key: "id",
                  equals: args.variables.unsubscribeFromUserId,
                });

                if (unsubscribeFromUser === null) {
                  throw fastify.httpErrors.notFound(
                    "User to unsubscribe from not found"
                  );
                }

                const userTriesToUnsubscribeFromHimself =
                  args.variables.currentUserId ===
                  args.variables.unsubscribeFromUserId;

                if (userTriesToUnsubscribeFromHimself) {
                  throw fastify.httpErrors.badRequest(
                    "User can't unsubscribe from himself"
                  );
                }

                try {
                  const subscribedUserIndex =
                    unsubscribeFromUser.subscribedToUserIds.indexOf(
                      args.variables.currentUserId
                    );

                  unsubscribeFromUser.subscribedToUserIds.splice(
                    subscribedUserIndex,
                    1
                  );

                  const patchedUser = await fastify.db.users.change(
                    args.variables.unsubscribeFromUserId,
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

      const userPostsDataLoader = await getUserPostsDataLoader(fastify);
      const userProfileDataLoader = await getUserProfileDataLoader(fastify);
      const memberTypeLoader = await getMemberTypeLoader(fastify);
      const userSubscribedToDataLoader = await getUserSubscribedToDataLoader(
        fastify
      );
      const subscribedToUserDataLoader = await getSubscribedToUserDataLoader(
        fastify
      );

      return graphql({
        schema: shema,
        source: query!,
        variableValues: variables,
        contextValue: {
          fastify,
          userPostsDataLoader,
          userProfileDataLoader,
          memberTypeLoader,
          userSubscribedToDataLoader,
          subscribedToUserDataLoader,
        },
      });
    }
  );
};

export default plugin;
