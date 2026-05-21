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

  const REPO = 'tannerbyers/current-tanner-website-v8';
  const BRANCH = process.env.GITHUB_BRANCH || 'main';

  if (req.method === 'GET') {
    const { path, action } = req.query;
    
    if (!path) {
      return res.status(400).json({ error: 'Path required' });
    }

    try {
      if (action === 'commits') {
        const url = `https://api.github.com/repos/${REPO}/commits?path=${path}&sha=${BRANCH}&per_page=1`;
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/json'
          }
        });

        if (!response.ok) {
          return res.status(response.status).json({ error: 'Failed to fetch commit history' });
        }

        const data = await response.json();
        let latestDate = null;
        let count = Array.isArray(data) ? data.length : 0;
        if (count > 0) {
          latestDate = data[0]?.commit?.committer?.date || data[0]?.commit?.author?.date || null;
        }

        const linkHeader = response.headers.get('link');
        if (linkHeader) {
          const match = linkHeader.match(/<[^>]+[?&]page=(\d+)[^>]*>\s*;\s*rel="last"/);
          if (match) {
            count = parseInt(match[1], 10) || count;
          }
        }

        return res.status(200).json({ latestDate, count });
      }

      const url = `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch contents' });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { path, content, message } = req.body || {};

    if (!path || !content || !message) {
      return res.status(400).json({ error: 'Path, content, and message required' });
    }

    try {
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
        content: Buffer.from(content).toString('base64'),
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

  return res.status(405).json({ error: 'Method not allowed' });
}