import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  /*
  console.log('Authenticating token...');
  */
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    /*
    console.log('No token found in request');
    */
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    /*
    console.log('Token verified successfully, user id:', user.id);
    */
    req.userId = user.id;
    next();
  });
};
