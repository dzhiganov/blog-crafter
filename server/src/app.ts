import fastify from "fastify";
import autoload from "@fastify/autoload";
import { join } from "desm";
import cors from "@fastify/cors";

export async function build(opts = {}) {
  const app = fastify(opts);

  app.register(cors);

  app.register(autoload, {
    dir: join(import.meta.url, "modules"),
    encapsulate: false,
    maxDepth: 1,
    forceESM: true,
  });

  return app;
}
