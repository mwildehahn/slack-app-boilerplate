import next from "next";
import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import cors from "kcors";
import logger from "koa-bunyan-logger";
import { parse as parseUrl } from "url";

import api from "./routers/api";
import auth from "./routers/auth";
import graphql from "./routers/graphql";
import authentication from "./middleware/authentication";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

async function main() {
  await app.prepare();

  const server = new Koa();
  const router = new Router();

  router.use(api.routes(), api.allowedMethods());
  router.use(auth.routes(), auth.allowedMethods());
  router.use(graphql.routes(), graphql.allowedMethods());
  router.get("*", async ctx => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(cors());
  server.use(bodyParser());
  server.use(logger({ level: "trace" }));
  server.use(logger.requestIdContext());
  server.use(logger.requestLogger());
  server.use(logger.timeContext());

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    try {
      await next();
    } catch (err) {
      ctx.log.error("Unhandled Exception", err);
      const parsedUrl = parseUrl(ctx.req.url, true);
      const { pathname, query } = parsedUrl;
      const html = await app.renderErrorToHTML(
        err,
        ctx.req,
        ctx.res,
        pathname,
        query
      );
      ctx.body = html;
      ctx.status = err.status || 500;
    }
  });

  authentication(server);
  server.use(router.routes());
  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}

main();
