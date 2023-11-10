import { NodeHtmlMarkdown } from "node-html-markdown";
import fs, { unlink } from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import { uploadToRepo } from "../utils.js";
import MarkdownIt from "markdown-it";

type PublishRequestBody = {
  path: string;
  meta: Record<string, string>;
  content: string;
};

export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.post<{ Body: PublishRequestBody; Reply: any }>(
    "/publish",
    async function handler(request, reply) {
      const { path: pathToFile = "", meta = {}, content = "" } = request.body;

      const mdIt = new MarkdownIt();
      const result = mdIt.render("# markdown-it rulezz!");

      const md = NodeHtmlMarkdown.translate(content);
      const REPO = "photography_blog";
      const BRANCH = "main";
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const workspacePath = path.join(__dirname, "../../..", "md");
      try {
        await fs.writeFile(pathToFile, md);
        await uploadToRepo(workspacePath, REPO, BRANCH);
        unlink(pathToFile);
      } catch (err) {
        console.log(err);
      }
    }
  );
}
