const { google } = require("googleapis");

const oauth2client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3500/aouth2"
);

const scopes = ["https://www.googleapis.com/auth/calender"];

const authUrl = oauth2client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "select_account",
});
