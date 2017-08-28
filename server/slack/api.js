import rp from "request-promise";

export async function call(method, form = {}, auth = null) {
  if (auth && auth.token) {
    form.token = auth.token;
  }

  const options = {
    method: "POST",
    uri: process.env.SLACK_API_ENDPOINT,
    json: true,
    form
  };

  let res;
  try {
    res = await rp(options);
  } catch (err) {
    throw err;
  }

  return res;
}

export default {
  call
};
