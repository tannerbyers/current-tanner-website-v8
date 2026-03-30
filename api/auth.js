const handler = async (req, res) => {
  // Support both GET (query param) and POST (body)
  let code = req.query.code || (req.body && req.body.code);
  
  // URL decode and clean the code
  if (code) {
    code = decodeURIComponent(code);
    // Remove any fragment or invalid characters (keep only hex alphanumeric)
    code = code.replace(/[^a-fA-F0-9]/g, '');
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'OAuth not configured' });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error_description || data.error });
    }

    res.json({ token: data.access_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = handler;