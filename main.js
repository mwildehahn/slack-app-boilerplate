// load up .env if environment variables are not loaded
if (!process.env.SLACK_CLIENT_ID) {
  console.log("> Loading local config");
  require("dotenv").config();
}

const server = "./server";

require("babel-polyfill");
require("babel-register");

require(server).default;
