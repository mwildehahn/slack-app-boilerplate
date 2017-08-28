import gql from "graphql-tag";

export default async (ctx, apollo) => {
  let loggedInUser = {};
  try {
    const { data } = await apollo.query({
      query: gql`
        query getUser {
          user {
            id
          }
        }
      `
    });
    loggedInUser = data;
  } catch (err) {}
  return loggedInUser;
};
