import { FastifyInstance, FastifyServerOptions } from "fastify";
import fetch from "node-fetch";
import { getGetContentURL } from "../endpoints.js";
import { GIT_HUB_API_HEADERS } from "../constants.js";
import { marked } from "marked";

type TQuerystring = {
  user: string;
  repo: string;
  branch?: string;
};

export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.get<{ Querystring: TQuerystring }>(
    "api/content/:path",
    async (req, reply) => {
      const { path } = req.params as any;
      const { user = "", repo = "", branch = "main" } = req.query;
      const token = req.headers[`x-github-token`];

      const responseContent = await fetch(
        getGetContentURL(user, repo, path) + `?ref=${branch}`,
        {
          method: "GET",
          headers: {
            ...GIT_HUB_API_HEADERS,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const [data] = (await responseContent.json()) || [];

      if (!data) {
        reply.code(404).send({
          message: "Article was not found",
        });
      } else {
        const { download_url } = data;
        const contentResponse = await fetch(download_url, {
          headers: {
            ["Content-Type"]: "text/markdown; charset=UTF-8",
          },
        });
        const md = await contentResponse.text();
        reply.code(200).send(toObject(md));
      }
    }
  );
}

function toObject(text: string) {
  const [start, end] = ["---", "---"];

  function toJSON(data: string) {
    if (!data) return {};

    const tmp: Record<string, string> = {};
    const lines = data.trim().split("\n");
    lines.forEach((line) => {
      const [key, val] = line.trim().split(":");
      tmp[key] = val;
    });
    return tmp;
  }

  function getMarkdownHeader(data: string) {
    const strReg = "^" + start + "([\\s|\\S]*?)" + end;
    const reg = new RegExp(strReg);
    const file = reg.exec(text);
    return file ? file[1] : "";
  }

  function getMarkdownContent(data: string) {
    const strReg = "^ *?\\" + start + "[^]*?" + end + "*";
    const reg = new RegExp(strReg);
    const content = data.replace(reg, "");

    return content ? marked(content) : "";
  }

  const meta = toJSON(getMarkdownHeader(text));
  const content = getMarkdownContent(text);

  return {
    meta,
    content,
  };
}
