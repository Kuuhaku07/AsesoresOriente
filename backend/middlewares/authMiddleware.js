import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.warn('JWT verification error: Token expired');
        return res.status(401).json({ error: 'Token expired' });
      } else {
        console.error('JWT verification error:', err.message);
        return res.status(403).json({ error: 'Invalid token' });
      }
    }
    req.userId = user.id;
    next();
  });
};
