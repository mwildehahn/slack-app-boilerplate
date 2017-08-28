import Router from "koa-router";
import passport from "koa-passport";

const router = new Router({
  prefix: "/auth"
});

router.get(
  "/slack",
  passport.authenticate("slack", {
    scope: "bot"
  })
);

router.get(
  "/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/",
    failureRedirect: "/?error=OAuth error with Slack"
  })
);

router.get("/logout", async ctx => {
  ctx.logout();
  ctx.redirect("/");
});

export default router;
