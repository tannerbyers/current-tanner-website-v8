export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    
    let code = req.query.code;
    
    if (!code) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing code' }));
      return;
    }

    const clientId = process.env.GITHUB_CLIENT_ID || process.env.OAUTH_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.OAUTH_GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'OAuth not configured' }));
      return;
    }

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
      res.statusCode = 400;
      res.end(JSON.stringify({ error: data.error_description || data.error }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ token: data.access_token }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
}