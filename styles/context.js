import { create } from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry } from "react-jss";
import createPalette from "material-ui/styles/palette";
import createMuiTheme from "material-ui/styles/theme";
import createGenerateClassName from "material-ui/styles/createGenerateClassName";

const theme = createMuiTheme({
  palette: createPalette({})
});

const jss = create(preset());
jss.options.createGenerateClassName = createGenerateClassName;

function createContext() {
  return {
    jss,
    theme,
    sheetsManager: new WeakMap(),
    sheetsRegistry: new SheetsRegistry()
  };
}

export function setContext() {
  global.__INIT_MATERIAL_UI__ = createContext();
}

export function getContext() {
  // Create a new store for every server-side request so data isn't shared
  // between connections
  if (!process.browser) {
    return global.__INIT_MATERIAL_UI__;
  }

  // Reuse context on the client-side
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
