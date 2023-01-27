import { FastifyPluginAsyncJsonSchemaToTs } from "@fastify/type-provider-json-schema-to-ts";
import { idParamSchema } from "../../utils/reusedSchemas";
import { changeMemberTypeBodySchema } from "./schema";
import type { MemberTypeEntity } from "../../utils/DB/entities/DBMemberTypes";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get("/", async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    const memberTypes = await fastify.db.memberTypes.findMany();
    return memberTypes;
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberType = await fastify.db.memberTypes.findOne({
        key: "id",
        equals: request.params.id,
      });

      if (!memberType) {
        throw fastify.httpErrors.notFound("Member type not found");
      }

      return memberType;
    }
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      try {
        const memberType = await fastify.db.memberTypes.findOne({
          key: "id",
          equals: request.params.id,
        });

        if (!memberType) {
          throw fastify.httpErrors.notFound("Member type not found");
        }

        const updated = await fastify.db.memberTypes.change(
          memberType.id,
          request.body
        );
        return updated;
      } catch (err: any) {
        throw fastify.httpErrors.badRequest(err);
      }
    }
  );
};

export default plugin;
