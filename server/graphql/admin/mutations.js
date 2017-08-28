import { patClient, systemClient } from "../client";
import { GraphQLClient } from "graphql-request";

export async function createTeam({ slackId, name, bot }) {
  const mutation = `mutation {
    createTeam(slackId: "${slackId}, name: "${name}", bot: ${bot}) {
      id
      slackId
      name
      bot {
        accessToken
        slackId
      }
    }
  }`;

  let res;
  try {
    res = await patClient.request(mutation);
  } catch (err) {
    throw err;
  }

  return res.Team;
}

export async function createUser({ slackId, teamId, accessToken }) {
  const mutation = `mutation {
    createUser(slackId: "${slackId}", teamId: "${teamId}", accessToken: "${accessToken}) {
      id
      slackId
      accessToken
    }
  }`;

  let res;
  try {
    res = await patClient.request(mutation);
  } catch (err) {
    throw err;
  }

  return res.User;
}

export async function generateUserToken(userId) {
  const mutation = `mutation {
    generateUserToken(input: {
      pat: "${process.env.GRAPHQL_PAT}",
      projectId: "${process.env.GRAPHQL_PROJECT_ID}",
      userId: "${userId}",
      modelName: "User"
    }) {
      token
    }
  }`;

  let res;
  try {
    res = await systemClient.request(mutation);
  } catch (err) {
    throw err;
  }

  return res.generateUserToken.token;
}
