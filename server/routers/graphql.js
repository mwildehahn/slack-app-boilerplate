import Router from "koa-router";

const router = new Router({
  prefix: "/graphql"
});

router.post("/", async ctx => {
  const { query, variables } = ctx.request.body;

  if (!ctx.state.client) {
    ctx.status = 403;
    return;
  }

  if (!query) {
    ctx.status = 400;
    return;
  }

  let res;
  try {
    res = await ctx.state.client.request(query, variables);
    res = { data: res };
  } catch (err) {
    if (err.response) {
      res = err.response;
    } else {
      throw err;
    }
  }

  ctx.body = res;
});

export default router;
