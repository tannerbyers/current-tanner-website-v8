module.exports = async (req, res) => {
  // Support both GET (query param) and POST (body)
  const code = req.query.code || (req.body && req.body.code);

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        client_id: 'Ov23liZ059WwqZlRDtSJ',
        client_secret: process.env.GITHUB_CLIENT_SECRET,
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