import { GIT_HUB_API_HEADERS } from "../constants.js";
import { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import { getGetReposURL } from "../endpoints.js";

type TQuerystring = {
  user: string;
};

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Querystring: TQuerystring }>(
    "api/repos",
    async (req, reply) => {
      const token = req.headers[`x-github-token`];
      const { user = "" } = req.query;
      const responseContent = await fetch(`${getGetReposURL(user)}`, {
        method: "GET",
        headers: {
          ...GIT_HUB_API_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await responseContent.json();

      reply.code(200).send({ items: data });
    }
  );
}
