import { FastifyInstance, FastifyServerOptions } from "fastify";
import fetch from "node-fetch";
import axios from "axios";

const CLIENT_ID = "3770f00f3de023a8260b";
const CLIENT_SECRET = "d03a0d9de024bc6722505023fc2da72d0a2b17a2";
const GIT_HUB_ACCESS_TOKEN = "https://github.com/login/oauth/access_token";

export const GIT_HUB_API_URL = `https://api.github.com`;
export const GIT_HUB_API_HEADERS = {
  Accept: "application/vnd.github.v3+json",
};

export default async function (
  fastify: FastifyInstance,
  opts: FastifyServerOptions
) {
  fastify.delete<{ Reply: any }>(
    "/api/session",
    async function handler(req, reply) {
      const token = req.headers[`x-github-token`];

      const res = await axios.delete(
        `https://api.github.com/applications/${CLIENT_ID}/token`,
        {
          auth: {
            username: CLIENT_ID,
            password: CLIENT_SECRET,
          },
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "token " + token,
          },
          data: {
            access_token: token,
          },
        }
      );
      //   const responseContent = await fetch(
      //     `https://api.github.com/applications/${CLIENT_ID}/grant`,
      //     {
      //       method: "DELETE",
      //       headers: {
      //         ...GIT_HUB_API_HEADERS,
      //         Authorization:
      //           "token " +
      //           Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      //       },
      //       body: `{"access_token":"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"}`,
      //     }
      //   ).then((d) => d.json());

      console.log("response content: " + res);
    }
  );
}
