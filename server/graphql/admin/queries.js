import { patClient } from "../client";

export async function getTeamBySlackId(slackId) {
  const query = `query {
    Team(slackId: "${slackId}") {
      id
      name
      slackId
      bot {
        accessToken
        slackId
      }
    }
   }`;

  let res;
  try {
    res = await patClient.request(query);
  } catch (err) {
    throw err;
  }

  return res.Team;
}

export async function getUserBySlackId(slackId) {
  const query = `query {
    User(slackId: "${slackId}") {
      id
      slackId
      team {
        id
      }
      accessToken
    }
  }`;

  let res;
  try {
    res = await patClient.request(query);
  } catch (err) {
    throw err;
  }

  return res.User;
}
