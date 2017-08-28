import { Component } from "react";
import { JssProvider } from "react-jss";
import {
  withStyles,
  MuiThemeProvider
} from "material-ui/styles";
import { getContext } from "../styles/context";

const styles = theme => ({
  "@global": {
    html: {
      background: theme.palette.background.default,
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale"
    },
    body: {
      margin: 0
    }
  }
});

let AppWrapper = props => props.children;

AppWrapper = withStyles(styles)(AppWrapper);

function withRoot(ComposedComponent) {
  class WithRoot extends Component {
    static displayName = `WithRoot(${ComposedComponent.displayName})`;

    static async getInitialProps(ctx) {
      let props = {};
      if (ComposedComponent.getInitialProps) {
        props = await ComposedComponent.getInitialProps(ctx);
      }

      return props;
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector("#jss-server-side");
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      const context = getContext();

      return (
        <JssProvider registry={context.sheetsRegistry} jss={context.jss}>
          <MuiThemeProvider
            theme={context.theme}
            sheetsManager={context.sheetsManager}
          >
            <AppWrapper>
              <ComposedComponent {...this.props} />
            </AppWrapper>
          </MuiThemeProvider>
        </JssProvider>
      );
    }
  }

  return WithRoot;
}

export default withRoot;
