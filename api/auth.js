// OAuth step 1: redirect user to GitHub authorization
module.exports = (req, res) => {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send("OAUTH_GITHUB_CLIENT_ID not configured");
  }

  const redirectUri = `${req.headers["x-forwarded-proto"] || "https"}://${req.headers.host}/api/callback`;
  const scope = "repo,user";

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.redirect(authUrl);
};
