import { FastifyInstance, FastifyServerOptions } from "fastify";
import fetch from "node-fetch";

const CLIENT_ID = "3770f00f3de023a8260b";
const CLIENT_SECRET = "d03a0d9de024bc6722505023fc2da72d0a2b17a2";
const GIT_HUB_ACCESS_TOKEN = "https://github.com/login/oauth/access_token";

interface Querystring {
  code: string;
}

export const GIT_HUB_API_URL = `https://api.github.com`;
export const GIT_HUB_API_HEADERS = {
  Accept: "application/vnd.github.v3+json",
};

// TODO move to the GitHub API module
export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.get<{ Reply: any; Querystring: Querystring }>(
    "/user",
    async function handler(req, reply) {
      const token = req.headers[`x-github-token`];
      const responseContent = await fetch(`${GIT_HUB_API_URL}/user`, {
        method: "GET",
        headers: {
          ...GIT_HUB_API_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });

      const { bio, name, avatar_url } = await responseContent.json();

      reply.send({
        bio,
        name,
        avatar_url,
      });
    }
  );
}
