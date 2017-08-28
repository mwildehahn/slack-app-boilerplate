import { GraphQLClient } from "graphql-request";

export function newClient(token, endpoint = process.env.GRAPHQL_API_ENDPOINT) {
  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const patClient = newClient(process.env.GRAPHQL_API_ENDPOINT);

export const systemClient = newClient(
  process.env.GRAPHQL_PAT,
  process.env.GRAPHQL_SYSTEM_API_ENDPOINT
);
