import Router from "koa-router";

const router = new Router({
  prefix: "/api/v1"
});

router.get("/hello", async ctx => {
  ctx.body = { hello: "world" };
});

export default router;
