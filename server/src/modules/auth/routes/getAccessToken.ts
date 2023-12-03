import { FastifyInstance, FastifyServerOptions } from "fastify";
import fetch from "node-fetch";

const CLIENT_ID = "3770f00f3de023a8260b";
const CLIENT_SECRET = "d03a0d9de024bc6722505023fc2da72d0a2b17a2";
const GIT_HUB_ACCESS_TOKEN = "https://github.com/login/oauth/access_token";

interface Querystring {
  code: string;
}

export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.get<{ Reply: any; Querystring: Querystring }>(
    "/api/get-access-token",
    async function handler(request, reply) {
      const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${request.query.code}&scope=repo user`;

      const response = await fetch(`${GIT_HUB_ACCESS_TOKEN}${params}`, {
        method: `POST`,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      reply.send(data);
    }
  );
}
