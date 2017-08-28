import { graphql, gql, compose, withApollo } from "react-apollo";

import withRoot from "../components/with-root";
import withData from "../components/with-data";

const page = ({ userQuery }) => {
  if (userQuery && userQuery.loading) {
    return <div>Loading...</div>;
  }

  if (userQuery && userQuery.error) {
    return (
      <div>
        Error: {userQuery.error}
      </div>
    );
  }

  return (
    <div>
      Hi! You're on team: {userQuery.user.team.name}
    </div>
  );
};

const query = graphql(
  gql`
    query {
      user {
        id
        team {
          id
          name
        }
      }
    }
  `,
  {
    name: "userQuery"
  }
);

export default compose(withRoot, withData, withApollo, query)(page);
