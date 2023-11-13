import { NodeHtmlMarkdown } from "node-html-markdown";
import fs, { unlink } from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import { Articles } from "../utils.js";
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
  fastify.put<{ Body: PublishRequestBody; Reply: any }>(
    "/publish",
    async function handler(req, reply) {
      const { path: pathInRepo = "", meta = {}, content = "" } = req.body;
      const token = req.headers[`x-github-token`];

      let md = NodeHtmlMarkdown.translate(content);
      let metaText = "---\n ";

      for (let [k, v] of Object.entries(meta)) {
        metaText += `${k}: ${v}\n`;
      }

      md = `${metaText}---\n${md}`;
      const REPO = "photography_blog";
      const BRANCH = "main";
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const workspacePath = path.join(__dirname, "../../..", "md");

      const fullPathToFile = path.join(workspacePath, "test.md");
      const articlesCRUD = new Articles(String(token));

      try {
        await fs.writeFile(fullPathToFile, md);
        await articlesCRUD.uploadToRepo(
          fullPathToFile,
          pathInRepo,
          REPO,
          BRANCH
        );
        unlink(fullPathToFile);
      } catch (err) {
        console.log(`Error:`, err);
      }
    }
  );

  type CreateNewArticleRequestBody = {
    name: string;
    meta: Record<string, string>;
    content: string;
  };

  fastify.post<{ Body: CreateNewArticleRequestBody; Reply: any }>(
    "/publish",
    async (req, res) => {
      const { name = "", meta = {}, content = "" } = req.body;
      const token = req.headers[`x-github-token`];

      let md = NodeHtmlMarkdown.translate(content);
      let metaText = "---\n";

      for (let [k, v] of Object.entries(meta)) {
        metaText += `${k.trim()}: ${v.trim()}\n`;
      }

      md = `${metaText}---\n${md}`;
      const REPO = "photography_blog";
      const BRANCH = "main";
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const workspacePath = path.join(__dirname, "../../..", "md");
      const pathInRepo = `content/blog/${name}`;

      const fullPathToFile = path.join(workspacePath, "test.md");
      const articlesCRUD = new Articles(String(token));

      try {
        await fs.writeFile(fullPathToFile, md);
        await articlesCRUD.uploadToRepo(
          fullPathToFile,
          pathInRepo,
          REPO,
          BRANCH
        );
        unlink(fullPathToFile);
      } catch (err) {
        console.log(`Error:`, err);
      }
    }
  );
}
