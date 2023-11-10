import autoload from "@fastify/autoload";
import { join } from "desm";

export default async function crud(fastify: any, opts: any) {
  fastify.register(autoload, {
    dir: join(import.meta.url, "routes"),
    forceESM: true,
  });
}
