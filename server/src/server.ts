import { build } from "./app.js";
import dotenv from "dotenv";
import "./types.js";

dotenv.config();

const opts = {
  logger: {
    level: "info",
  },
};

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const run = async () => {
  try {
    const app = await build(opts);
    app.listen({ port });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

run();
