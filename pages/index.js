import { Component } from "react";
import Head from "next/head";
import Link from "next/link";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { withApollo, compose } from "react-apollo";

import withRoot from "../components/with-root";
import withData from "../components/with-data";
import redirect from "../components/redirect";
import getLoggedInUser from "../components/get-logged-in-user";
import Header from "../components/header";

const styles = {
  container: {},
  body: {
    paddingTop: 200,
    textAlign: "center"
  }
};

class Page extends Component {
  static displayName = "Page";

  static async getInitialProps(ctx, apollo) {
    const loggedInUser = await getLoggedInUser(ctx, apollo);
    return {
      loggedInUser
    };
  }

  render() {
    const { loggedInUser } = this.props;

    return (
      <div style={styles.container}>
        <Header user={loggedInUser.user} />
        <div style={styles.body}>
          <Typography type="headline" gutterBottom>
            App Boiler Plate
          </Typography>
        </div>
      </div>
    );
  }
}

export default compose(withRoot, withData)(Page);
