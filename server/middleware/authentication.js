import passport from "koa-passport";
import session from "koa-session";
import convert from "koa-convert";
import { call } from "../slack/api";
import { newClient } from "../graphql/client";
import { getTeamBySlackId, getUserBySlackId } from "../graphql/admin/queries";
import {
  createTeam,
  createUser,
  generateUserToken
} from "../graphql/admin/mutations";
import { encrypt, decrypt } from "../utils/crypto";

import OAuth2Strategy from "passport-oauth2";

async function serializeUser({ userToken }, done) {
  const start = new Date();
  const sessionData = { userToken };
  const serialized = JSON.stringify(sessionData);
  const encrypted = encrypt(serialized);
  const end = new Date();

  done(null, encrypted);
}

async function deserializeUser(encrypted, done) {
  const start = new Date();
  const json = decrypt(encrypted);
  const data = JSON.parse(json);
  const end = new Date();

  done(null, data);
}

async function createTeamWithParams(params) {
  const variables = {
    name: params.team_name,
    slackId: params.team_id,
    bot: {
      slackId: params.bot.bot_user_id,
      accessToken: params.bot.bot_access_token
    }
  };

  return createTeam(variables);
}

async function createUserWithParams(teamId, params) {
  const variables = {
    accessToken: params.access_token,
    slackId: params.user_id,
    teamId
  };

  return createUser(variables);
}

async function authenticate(token, tokenSecret, params, profile, done) {
  let team;
  let user;

  try {
    team = await getTeamBySlackId(params.team_id);
  } catch (err) {
    return done(err);
  }

  if (!team) {
    try {
      team = await createTeamWithParams(params);
    } catch (err) {
      return done(err);
    }
  }

  try {
    user = await getUserBySlackId(params.user_id);
  } catch (err) {
    return done(err);
  }

  if (!user) {
    try {
      user = await createUserWithParams(team.id, params);
    } catch (err) {
      return done(err);
    }
  }

  if (!team) return done(new Error("Missing Team"));
  if (!user) return done(new Error("Missing User"));

  let userToken;
  try {
    userToken = await generateUserToken(user.id);
  } catch (err) {
    return done(err);
  }

  done(null, {
    userToken
  });
}

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(
  "slack",
  new OAuth2Strategy(
    {
      authorizationURL: "https://slack.com/oauth/authorize",
      tokenURL: "https://slack.com/api/oauth.access",
      clientID: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      callbackURL: "/auth/slack/callback"
    },
    authenticate
  )
);

export default server => {
  server.keys = [process.env.SECRET];
  server.use(session(server));
  server.use(passport.initialize());
  server.use(passport.session());
  server.use((ctx, next) => {
    // Attach an authenticated client to the request
    if (ctx.state && ctx.state.user && ctx.state.user.userToken) {
      ctx.req.userToken = ctx.state.user.userToken;
      ctx.state.client = newClient(ctx.state.user.userToken);
    }

    return next();
  });
};
