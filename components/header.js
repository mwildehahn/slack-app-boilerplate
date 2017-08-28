import PropTypes from "prop-types";
import AppBar from "material-ui/AppBar";
import Button from "material-ui/Button";
import Toolbar from "material-ui/Toolbar";

const propTypes = {
  user: PropTypes.object
};

const styles = {
  toolbar: {
    display: "flex",
    justifyContent: "flex-end"
  }
};

const Header = ({ user }) => {
  let href;
  let buttonText;
  if (user) {
    href = "/auth/logout";
    buttonText = "Logout";
  } else {
    href = "/auth/slack";
    buttonText = "Login";
  }

  return (
    <AppBar position="static">
      <Toolbar style={styles.toolbar}>
        <Button color="contrast" href={href}>
          {buttonText}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = propTypes;

export default Header;
