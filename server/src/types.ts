import { Octokit } from "octokit";

declare module "fastify" {
  export interface FastifyInstance {
    octokit: any;
  }
}
