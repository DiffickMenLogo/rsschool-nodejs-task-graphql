import * as DataLoader from "dataloader";
import { FastifyInstance } from "fastify";
import { MemberTypeEntity } from "../../../utils/DB/entities/DBMemberTypes";
import { ProfileEntity } from "../../../utils/DB/entities/DBProfiles";
import { UserEntity } from "../../../utils/DB/entities/DBUsers";
export const getUserProfileDataLoader = async (fastify: FastifyInstance) =>
  new DataLoader(async (userIds) => {
    const profiles = await fastify.db.profiles.findMany();

    const profilesMap = profiles.reduce(
      (map, profile) => map.set(profile.userId, profile),
      new Map<string, ProfileEntity>()
    );

    return userIds.map((userId) => profilesMap.get(String(userId)) ?? null);
  });

export const getMemberTypeLoader = async (fastify: FastifyInstance) =>
  new DataLoader(async (memberTypeIds) => {
    const memberTypes = await fastify.db.memberTypes.findMany();

    const memberTypesMap = memberTypes.reduce(
      (map, memberType) => map.set(memberType.id, memberType),
      new Map<string, MemberTypeEntity>()
    );

    return memberTypeIds.map(
      (memberTypeId) => memberTypesMap.get(String(memberTypeId)) ?? null
    );
  });

export const getUserPostsDataLoader = async (fastify: FastifyInstance) =>
  new DataLoader(async (userIds) => {
    const posts = await fastify.db.posts.findMany();

    return userIds.map((userId) =>
      posts.filter((post) => post.userId === userId)
    );
  });

export const getUserSubscribedToDataLoader = async (fastify: FastifyInstance) =>
  new DataLoader<string, UserEntity[]>(async (userIds) => {
    const users = await fastify.db.users.findMany();

    return userIds.map((userId) =>
      users.filter((user) => user.subscribedToUserIds.includes(userId))
    );
  });

export const getSubscribedToUserDataLoader = async (fastify: FastifyInstance) =>
  new DataLoader(async (userIds) => {
    const users = await fastify.db.users.findMany();

    const usersMap = users.reduce(
      (map, user) => map.set(user.id, user),
      new Map<string, UserEntity>()
    );

    return userIds.map((userId) => usersMap.get(String(userId)) ?? null);
  });
