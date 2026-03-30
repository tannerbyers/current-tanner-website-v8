const https = require("https");

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let chunks = "";
      res.on("data", (c) => (chunks += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(chunks));
        } catch (e) {
          reject(new Error(chunks));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Missing code parameter");
  }

  try {
    const data = await postJSON("https://github.com/login/oauth/access_token", {
      client_id: process.env.OAUTH_GITHUB_CLIENT_ID,
      client_secret: process.env.OAUTH_GITHUB_CLIENT_SECRET,
      code,
    });

    const token = data.access_token;
    if (!token) {
      return res.status(500).send("Failed to get access token from GitHub");
    }

    const html = `
<!doctype html>
<html>
<body>
<p>Completing authentication...</p>
<script>
(function() {
  if (window.opener) {
    window.opener.postMessage(
      'tina::auth::success:' + JSON.stringify({ token: '${token}', provider: 'github' }),
      window.location.origin
    );
    window.close();
  } else {
    document.body.innerHTML = "<p>Error: Lost reference to the CMS window. Please close this tab and try again.</p>";
  }
})();
</script>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    res.status(500).send("OAuth error: " + err.message);
  }
};