import { NodeHtmlMarkdown } from "node-html-markdown";
import fs, { unlink } from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import { Articles } from "../utils.js";

type PublishRequestBody = {
  path: string;
  meta: Record<string, string>;
  content: string;
  user: string;
  repo: string;
  branch?: string;
  pathToContent: string;
};

export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.put<{ Body: PublishRequestBody; Reply: any }>(
    "/api/publish",
    async function handler(req, reply) {
      const {
        path: pathInRepo = "",
        meta = {},
        content = "",
        user = "",
        repo = "",
        branch = "main",
      } = req.body;
      const token = req.headers[`x-github-token`];

      let md = NodeHtmlMarkdown.translate(content);
      let metaText = "---\n";

      for (let [k, v] of Object.entries(meta)) {
        metaText += `${k}: ${v}\n`;
      }

      md = `${metaText}---\n${md}`;
      const REPO = repo;
      const BRANCH = branch;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const workspacePath = path.join(__dirname, "../../..", "md");

      const fullPathToFile = path.join(workspacePath, "test.md");
      const articlesCRUD = new Articles({
        accessToken: String(token),
        user,
      });

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
    user: string;
    repo: string;
    branch?: string;
    path: string;
  };

  fastify.post<{ Body: CreateNewArticleRequestBody; Reply: any }>(
    "/api/publish",
    async (req, res) => {
      const {
        name = "",
        meta = {},
        content = "",
        user = "",
        repo = "",
        branch = "main",
        path: pathToContent = "",
      } = req.body;
      const token = req.headers[`x-github-token`];

      let md = NodeHtmlMarkdown.translate(content);
      let metaText = "---\n";

      for (let [k, v] of Object.entries(meta)) {
        metaText += `${k.trim()}: ${v.trim()}\n`;
      }

      md = `${metaText}---\n${md}`;

      return;
      const REPO = repo;
      const BRANCH = branch;
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);
      const workspacePath = path.join(__dirname, "../../..", "md");
      const pathInRepo = `${pathToContent}/${name}`;

      const fullPathToFile = path.join(workspacePath, "test.md");
      const articlesCRUD = new Articles({
        accessToken: String(token),
        user,
      });

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
