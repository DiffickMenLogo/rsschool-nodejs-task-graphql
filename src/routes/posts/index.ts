import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { createPostBodySchema, changePostBodySchema } from "./schema";
import type { PostEntity } from "../../utils/DB/entities/DBPosts";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<PostEntity[]> {
    const posts = await fastify.db.posts.findMany();
    return posts;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const post = await fastify.db.posts.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!post) {
        throw fastify.httpErrors.notFound("Post not found");
      }

      return post;
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const author = await fastify.db.users.findOne({
        key: "id",
        equals: request.body.userId,
      });

      if (!author) {
        throw fastify.httpErrors.notFound("Author not found");
      }

      const created = await fastify.db.posts.create(request.body);
      return created;
    }
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const post = await fastify.db.posts.findOne({
          key: "id",
          equals: request.params.id,
        });

        if (!post) {
          throw fastify.httpErrors.notFound("Post not found");
        }

        await fastify.db.posts.delete(post.id);
        return post;
      } catch (err: any) {
        throw fastify.httpErrors.badRequest(err);
      }
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      try {
        const changePost = await fastify.db.posts.change(
          request.params.id,
          request.body
        );

        return changePost;
      } catch (err: any) {
        throw fastify.httpErrors.badRequest(err);
      }
    }
  );
};

export default plugin;
