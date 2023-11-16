import { GIT_HUB_API_HEADERS } from "../constants.js";
import { FastifyInstance } from "fastify";
import fetch from "node-fetch";
import { getGetContentURL } from "../endpoints.js";

type TQuerystring = {
  user: string;
  repo: string;
  path: string;
  branch?: string;
};

export default async function (fastify: FastifyInstance) {
  fastify.get<{
    Querystring: TQuerystring;
  }>("/content", async (res, reply) => {
    const token = res.headers[`x-github-token`];
    const { user = "", repo = "", path = "", branch = "main" } = res.query;
    const responseContent = await fetch(
      `${getGetContentURL(user, repo, path)}?ref=${branch}`,
      {
        method: "GET",
        headers: {
          ...GIT_HUB_API_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await responseContent.json();

    const itemsCollection = Array.isArray(data) ? data : [data];

    const files = [];
    const dirs = [];

    for (let it of itemsCollection) {
      // it is a file
      if (it.download_url) {
        files.push(it);
      } else {
        dirs.push(it);
      }
    }

    if (dirs.length > 0) {
      const queries = dirs.map(async ({ path }) => {
        const res = await fetch(
          `${getGetContentURL("delawere", "photography_blog", path)}?ref=main`,
          {
            method: "GET",
            headers: GIT_HUB_API_HEADERS,
          }
        );

        const data = await res.json();

        return {
          ...data[0],
          parent: path,
        };
      });

      const responses = await Promise.all(queries);

      for (let it of responses) {
        // it is a file
        files.push(it);
      }
    }

    const items = files.map(({ download_url, name, parent, sha }) => {
      return {
        download_url,
        name,
        parent,
      };
    });

    reply.code(200).send({ items: items });
  });
}
