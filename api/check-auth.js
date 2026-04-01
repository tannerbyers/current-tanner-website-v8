export default async function handler(req, res) {
  const token = req.cookies?.admin_token;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!token || !adminPassword) {
    return res.status(200).json({ authenticated: false });
  }

  const expectedToken = Buffer.from(adminPassword).toString('base64');
  const authenticated = token === expectedToken;

  return res.status(200).json({ authenticated });
}