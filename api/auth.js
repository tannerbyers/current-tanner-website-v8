export default async function handler(req, res) {
  try {
    res.setHeader('Content-Type', 'application/json');
    
    let code = req.query.code;
    
    if (!code) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing code' }));
      return;
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ 
      message: 'Function working', 
      code: code.substring(0, 5) + '...',
      envCheck: {
        hasGithubClientId: !!process.env.GITHUB_CLIENT_ID,
        hasOauthClientId: !!process.env.OAUTH_GITHUB_CLIENT_ID
      }
    }));
  } catch (err) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
}