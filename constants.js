require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "fak3conomy@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "fak3conomy@gmail.com>",
  subject: "Verify your account",
};

module.exports = {
  auth,
  mailoptions,
};