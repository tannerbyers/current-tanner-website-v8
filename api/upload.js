export default async function handler(req, res) {
  const token = req.cookies?.admin_token;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!token || !adminPassword || token !== Buffer.from(adminPassword).toString('base64')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return res.status(500).json({ error: 'GitHub not configured' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { path, content, message } = req.body || {};
    
    if (!content || !path || !message) {
      return res.status(400).json({ error: 'Content, path, and message required' });
    }

    const REPO = 'tannerbyers/current-tanner-website-v8';
    const BRANCH = process.env.GITHUB_BRANCH || 'main';
    const url = `https://api.github.com/repos/${REPO}/contents/${path}`;

    let sha = null;
    const getResponse = await fetch(`${url}?ref=${BRANCH}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: 'application/json'
      }
    });

    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }

    const body = {
      message,
      content,
      branch: BRANCH
    };
    if (sha) body.sha = sha;

    const putResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${githubToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!putResponse.ok) {
      const error = await putResponse.json();
      return res.status(putResponse.status).json({ error: error.message || 'Upload failed' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}