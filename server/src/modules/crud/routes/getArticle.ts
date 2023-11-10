import { FastifyInstance, FastifyServerOptions } from "fastify";
import fetch from "node-fetch";
import { getGetContentURL } from "../endpoints.js";
import { GIT_HUB_API_HEADERS } from "../constants.js";
import { marked } from "marked";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.get("/content/:path", async (res, reply) => {
    const { path } = res.params as any;
    const responseContent = await fetch(
      getGetContentURL("delawere", "photography_blog", path) + "?ref=main",
      {
        method: "GET",
        headers: GIT_HUB_API_HEADERS,
      }
    );

    const data = await responseContent.json();

    const itemsCollection = Array.isArray(data) ? data : [data];

    const response = await fetch(itemsCollection[0].download_url);
    const md = await response.text();

    reply.code(200).send(toObject(md));
  });
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
    const file = reg.exec(data);
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
